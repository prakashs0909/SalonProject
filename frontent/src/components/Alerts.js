import React from 'react'

function Alerts(props) {
    const capitalize = (word)=>{
      if (word==="danger") {
        word = "error"
      }
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
  return (
        <div style={{height: '38px'}}>
        {props.alert && <div className={`alert alert-${props.alert.typ} alert-dismissible fade show`} role="alert">
        <strong>{capitalize(props.alert.typ)}</strong>: {props.alert.msg}
        </div>}
    </div>
  )
}

export default Alerts
