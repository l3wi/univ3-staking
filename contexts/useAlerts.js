import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
  useCallback
} from 'react'

import { web3 } from '../utils/ethers'

export const UseAlertContext = createContext()

export const AlertProvider = (props) => {
  // Remember your alerts
  const [alerts, setAlerts] = useState([])

  // add - add alert
  const addAlert = (type, text) => {
    const id = alerts.length
    setAlerts([...alerts, { type, text }])
    if (type != 'pending') {
      setTimeout(() => {
        removeAlert(id)
      }, 10000)
    }
    return id
  }
  // remove - remove alerts (clear & rm on success fail)
  const removeAlert = (id) => {
    setTimeout(() => {
      setAlerts(alerts.splice(id, 1))
    }, 1000)
  }
  // watchTx - listen for success/fail
  const watchTx = (hash, actionName) => {
    const id = addAlert('pending', actionName)
    return new Promise((resolve, reject) => {
      web3.once(hash, (transaction) => {
        setTimeout(() => {
          removeAlert(id)
        }, 3000)
        if (transaction.status === 1) {
          addAlert('success', actionName)
          resolve(transaction)
        } else {
          addAlert('fail', actionName)
          reject(transaction)
        }
      })
    })
  }

  const tools = useMemo(
    () => ({
      alerts,
      addAlert,
      removeAlert,
      watchTx
    }),
    [alerts]
  )

  // pass the value in provider and return
  return (
    <UseAlertContext.Provider
      value={{
        tools
      }}
    >
      {props.children}
    </UseAlertContext.Provider>
  )
}

export function useAlerts() {
  const alertContext = useContext(UseAlertContext)
  if (alertContext === null) {
    throw new Error(
      'useAlert() can only be used inside of <UseAlertProvider />, ' +
        'please declare it at a higher level.'
    )
  }
  const { tools } = alertContext

  return useMemo(() => ({ ...tools }), [tools])
}

export default useAlerts
