const socket = io("http://localhost:4000",{});

const liveUpbhokta = document.getElementById('Upbhokta');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageFeedback = document.getElementById('message-feedback');
const messageTone = new Audio('/Iphone Ting - Message Tone.mp3');

messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    sendMessage()
})

socket.on('Upbhokta',(data)=>{
    Upbhokta.innerText = `Total Clients: ${data}`
})

function sendMessage(){
    if(messageInput.value === '')
    return;
    // console.log(messageInput.value);
    const data = {
        id: socket.id,
        name:nameInput.value,
        message:messageInput.value,
        dateTime: new Date()
    }
    socket.emit('message',data);
    addMessageToUI(true,data);
    messageInput.value = "";
}

socket.on('chat-message',(data)=>{
    // console.log(data);
    messageTone.play();
    addMessageToUI(false,data);
    })

    function addMessageToUI(isOwnMessage, data) {
        clearFeedback();
        const element = `
          <li class="${isOwnMessage ? "message-right" : "message-left"}">
            <p class="message">
              ${data.message}
              <span>${data.name} 🧧 ${moment(data.dateTime).fromNow()}</span>
            </p>
          </li>`;
      
        messageContainer.innerHTML += element; 
        scrollToBottom();
      }
    function scrollToBottom(){
        messageContainer.scrollTo(0,messageContainer.scrollHeight);
    } 
    messageInput.addEventListener('focus',(e)=>{
        socket.emit('feedback',{
            feedback:`${nameInput.value} is typing a message`
        })
    })

    messageInput.addEventListener('keypress',(e)=>{
        socket.emit('feedback',{
            feedback:`${nameInput.value} is typing a message`
        })
    })
    messageInput.addEventListener('blur',(e)=>{
        socket.emit('feedback',{
            feedback:``,
        })
    })

socket.on('feedback',(data) =>{
    clearFeedback();
    const element = `
         <li class="message-feedback">
         <p class="feedback" id="feedback">${data.feedback}</p>
         </li>
        `

        messageContainer.innerHTML += element;
})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element =>{
        element.parentNode.removeChild(element);
    })
}
 