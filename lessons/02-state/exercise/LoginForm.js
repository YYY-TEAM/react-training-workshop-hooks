import React, { useState } from "react"
import VisuallyHidden from "@reach/visually-hidden"
import { FaSignInAlt } from "react-icons/fa"
import TabsButton from "app/TabsButton"
import { login } from "app/utils"

// import LoginFormFinal from './LoginForm.final'
// export default LoginFormFinal

export default function LoginForm() {
  const [checked, updateChecked] = useState(false)
  const [loading, changeLoading] = useState(false)
  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        changeLoading(true)
        const [emailNode, passwordNode] = event.target.elements
        const email = emailNode.value
        const password = passwordNode.value
        login(email, password)
          .then(() => {
            changeLoading(false)
          })
          .catch(error => alert(error))
      }}
    >
      <VisuallyHidden>
        <label htmlFor="login:email">Email:</label>
      </VisuallyHidden>
      <input
        type="text"
        id="login:email"
        className="inputField"
        placeholder="you@example.com"
      />

      <VisuallyHidden>
        <label htmlFor="login:password">Password:</label>
      </VisuallyHidden>
      <input
        id="login:password"
        type={checked ? "text" : "password"}
        className="inputField"
        placeholder="Password"
      />

      <div>
        <label>
          <input
            className="passwordCheckbox"
            type="checkbox"
            defaultChecked={checked}
            onChange={() => updateChecked(!checked)}
          />{" "}
          show password
        </label>
      </div>

      <TabsButton>
        <FaSignInAlt />
        <span>{loading ? "Loading.. " : "Login"}</span>
      </TabsButton>
    </form>
  )
}
