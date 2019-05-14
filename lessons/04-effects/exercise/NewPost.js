import React, { useState, useEffect, useRef } from "react"
import { FaDumbbell } from "react-icons/fa"

import { useAppState } from "app/app-state"
import { formatDate, DATE_FORMAT } from "app/utils"
import Avatar from "app/Avatar"
import Minutes from "app/Minutes"
import RecentPostsDropdown from "app/RecentPostsDropdown"

const MAX_MESSAGE_LENGTH = 200

export default function NewPost({ takeFocus, date, onSuccess, showAvatar }) {
  const [{ auth }] = useAppState()
  const key = makeNewPostKey(date)
  const [message, setMessage] = useState(getLocalStorageValue(key) || "")
  const messageTooLong = message.length > MAX_MESSAGE_LENGTH
  const messageInputRef = useRef()

  function handleMessageChange(event) {
    setMessage(event.target.value)
  }

  useEffect(() => {
    setLocalStorage(key, message)
  }, [key, message])

  useEffect(() => {
    if (takeFocus) {
      //focus text area
      messageInputRef.current.focus()
    }
  }, [takeFocus])
  return (
    <div className={"NewPost" + (messageTooLong ? " NewPost_error" : "")}>
      {showAvatar && <Avatar uid={auth.uid} size={70} />}
      <form className="NewPost_form">
        <textarea
          ref={messageInputRef}
          className="NewPost_input"
          placeholder="Tell us about your workout!"
          value={message}
          onChange={handleMessageChange}
        />
        <div className="NewPost_char_count">
          {message.length}/{MAX_MESSAGE_LENGTH}
        </div>
        <RecentPostsDropdown uid={auth.uid} onSelect={setMessage} />
        <div className="NewPost_buttons">
          <Minutes date={date} />
          <div>
            <button type="submit" className="icon_button cta">
              <FaDumbbell /> <span>Post</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function makeNewPostKey(date) {
  return `newPost:${formatDate(date, DATE_FORMAT)}`
}

function getLocalStorageValue(key) {
  const value = localStorage.getItem(key)
  if (!value) return null
  try {
    return JSON.parse(value)
  } catch (e) {
    return null
  }
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}
/*
# Effects

## Save state to local storage

Save the message value into localStorage so that if the user accidentally closes the dialog or navigates away from the page, we can bring it back!

There are a few helper functions to work with localStorage that we've added:

`makeNewPostKey(date)` - Pass it the date and it will return a key for use with localStorage unique to that date.

`getLocalStorageValue(key)` - Returns the value from localStorage for the given `key`.

`setLocalStorage(key, value)` - Sets the value.

- add an effect that depends on the `message`.
- in the effect, save the message into local storage
----
- click on a calendar button and type in a message
- reload the page w/o submitting, then click the same calendar button as before.
  - the value is not prepopulated, why not?
- get the value from local storage and set it as your initial state for `message`.
- reload the page and click the button again
  - alright!
- remove `message` from the dependencies array, but leave it there blank like `[]`, and try again
  - what happens and why?
  - now remove the `[]` altogether, now what happens and why?
  - if we use the array, did we have all the values we should have?
  - what's the difference between having the array and not having it?

## Move focus if the `takeFocus` prop comes in `true`

`NewPost` is used in two contexts, the dialog we've been working in, and then as another entry on a day with 1 or more entries already.

- Click on a calendar with a post
- Click the "add another" button

What we'd like is to move focus to the input automatically. The component that rendered `NewPost` has passed you a prop called `takeFocus`. If it's true, you should focus the message textarea.

You'll need to `useRef` for the textarea and the following DOM api to focus it. If you named your ref `messageRef`, it looks like this:

```
messageRef.current.focus()
```

To validate if you did it right, click "add another" and the focus should move to the textarea.

You're on your own for this one!
*/
