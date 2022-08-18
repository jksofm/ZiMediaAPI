

function ResetPassword(url,name) {
  return (
    `
    <div>
    <h1>Hello ${name}</h1>
    <p> Your reset url :  ${url} </p>
    </div>
    `
  )
}

export default ResetPassword