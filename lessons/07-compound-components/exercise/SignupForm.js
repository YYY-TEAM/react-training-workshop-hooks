import React, { Fragment, useState } from "react"
import VisuallyHidden from "@reach/visually-hidden"
import { FaDumbbell } from "react-icons/fa"

import { signup } from "app/utils"
import TabsButton from "app/TabsButton"
import DateFields, { MonthField, DayField, YearField } from "app/DateFields"

function TextInput({ id, label, type = "text" }) {
  return (
    <Fragment>
      <VisuallyHidden>
        <label htmlFor={id}>{label}</label>
      </VisuallyHidden>
      <input id={id} placeholder={label} type={type} required />
    </Fragment>
  )
}

export default function SignupForm() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState(new Date("March 1, 2019"))

  const handleSignup = async event => {
    event.preventDefault()
    setLoading(true)
    const [displayName, photoURL, email, password] = event.target.elements
    try {
      await signup({
        displayName: displayName.value,
        email: email.value,
        password: password.value,
        photoURL: photoURL.value,
        startDate
      })
    } catch (error) {
      setLoading(false)
      setError(error)
    }
  }

  return (
    <div>
      {error && (
        <div>
          <p>Oops, there was an error logging you in.</p>
          <p>
            <i>{error.message}</i>
          </p>
        </div>
      )}

      <form onSubmit={handleSignup}>
        <TextInput id="displayName" label="Display Name" />
        <TextInput id="photoURL" label="Avatar URL" />
        <TextInput id="email" label="Email" />
        <TextInput id="password" label="Password" />
        <p>
          <span>Start:</span>{" "}
          <DateFields value={startDate} onChange={setStartDate}>
            <MonthField aria-label="Start Month" />
            <DayField aria-label="Start Day" />
            <YearField start={2018} end={2019} aria-label="Start year" />
          </DateFields>
        </p>
        <TabsButton>
          <FaDumbbell />
          <span>{loading ? "Loading..." : "Sign Up"}</span>
        </TabsButton>
      </form>
    </div>
  )
}

/*
# Compound Components

We want to give rendering control to the owner of `<Datefields/>`. Maybe we're in the United Kingdom and we need to put the day, not the month, first. And what if we wanted to add additionaly props to the `<select>` elements, like aria-labels, or classNames?

We can either make a bunch of weird props:

```jsx
<DateFields
  fieldOrder={["day", "month", "year"]}
  monthSelectProps={{
    className: "month-select",
    "aria-label": "start month"
  }}
  yikes-no-thanks
/>
```

Or we can create a composable solution with compound components.

Open up `SignupForm.js` and find where we're rendering `<DateFields/>`.

Your task is to use context to give rendering control back to the consumer. So instead of this:

```jsx
<DateFields
  value={...}
  start={...}
  end={...}
  onSelect={...}
/>
```

We want this:

```jsx
<DateFields value={startDate} onChange={setStartDate}>
  <MonthField aria-label="Start Month" />
  <DayField aria-label="Start Day" />
  <YearField start={2018} end={2019} aria-label="Start year" />
</DateFields>
```

1. Change `SignupForm.js` to render the the new `DateFields` API with compound components as shown above.

2. Edit `DateFields.js` to stop rendering the individual components in `DateFields`, but instead just rendering `props.children`.

3. Provide context in `DateFields` for the other components to use.

4. Use context in `MonthField`, `DayField`, and `YearField`.

5. Go back to `SignupForm.js` and you can tweak the order of the fields, put other values around them, do whatever you want!

*/
