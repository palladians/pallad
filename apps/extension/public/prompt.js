/* eslint-disable */
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search)
  const message = params.get('message')
  const inputType = params.get('inputType')
  const windowId = parseInt(params.get('windowId'));

  document.getElementById('message').textContent = message

  const userInput = document.getElementById('user-input')
  const confirmSection = document.getElementById('confirm-section')
  const inputSection = document.getElementById('input-section')
  const submitButton = document.getElementById('submit-button')

  if (inputType === 'text' || inputType === 'password') {
    userInput.setAttribute('type', inputType)
    inputSection.style.display = 'flex' // Show input section
  } else if (inputType === 'confirmation') {
    confirmSection.style.display = 'flex' // Show confirmation section
  }

  submitButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      windowId: windowId,
      userInput: userInput.value
    })
    //window.close()
  })

  document.getElementById('confirm-yes').addEventListener('click', () => {
    chrome.runtime.sendMessage({
      windowId: windowId,
      userConfirmed: true
    })
    //window.close()
  })

  document.getElementById('confirm-no').addEventListener('click', () => {
    chrome.runtime.sendMessage({
      windowId: windowId,
      userConfirmed: false
    })
    //window.close()
  })

  document.getElementById('cancel-button').addEventListener('click', () => {
    chrome.runtime.sendMessage({
      //windowId: windowId,
      userRejected: true
    })
    //window.close()
  })
})
