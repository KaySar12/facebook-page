const host = 'http://localhost:8000';
const getConversation = async (id) => {
  try {
    const res = await fetch(`${host}/facebook/page/conversation/${id}`, {
      method: 'GET',
      redirect: 'follow',
    });
    const rs = await res.json();
    return rs;
  } catch (err) {
    window.alert('Error at getConversation post');
    console(err);
  }
};
// Function to format the date
function formatDate(dateTimeString) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };
  const dateTime = new Date(dateTimeString);
  return new Intl.DateTimeFormat('en-US', options).format(dateTime);
}
window.addEventListener('DOMContentLoaded', (event) => {
  new Vue({
    el: '#app',
    data: {
      chats: [],
      username: '',
      sender: '',
      receiver: '',
    },
    async created() {
      const conversationId = document
        .getElementById('conversationId')
        .getAttribute('value');
      console.log(`conversationId: ${conversationId}`);
      const conversation = await getConversation(conversationId);
      const messages = conversation.messages.data;
      const sender = conversation.senders.data[1].name;
      const receiver = conversation.senders.data[0].name;

      console.log('loading history');
      messages.forEach((data) => {
        const response = {
          attachments: data.attachments,
          sticker: data.sticker,
          message: data.message,
          from: data.from.name,
          created_time: formatDate(data.created_time),
          sender: sender,
          receiver: receiver,
        };
        this.chats.push(response);
      });
      let pusher = new Pusher('6733a2156ab8670aa489', {
        cluster: 'ap1',
        useTLS: true,
      });
      const channel = pusher.subscribe('chats');
      channel.bind('new-chat', (data) => {
        const response = {
          attachments: '',
          message: data.message,
          from: '',
          created_time: '',
        };
        this.chats.push(response);
      });
    },
    methods: {
      //this need to change
      postMessages(event) {
        const chatMessage = event.target.value;
        if (event.keyCode === 13 && !event.shiftKey) {
          const chat = {
            attachments: '',
            message: chatMessage,
            from: '',
            created_time: '',
          };
          event.target.value = '';
          axios.post('/message', chat).then((data) => {
            console.log(data);
          });
        }
      },
    },
  });
});
