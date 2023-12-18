const host = 'http://localhost:8000';
const getConversation = async (id) => {
  try {
    const res = await fetch(`${host}/facebook/page/conversation/${id}`, {
      method: 'GET',
      redirect: 'follow',
    });
    const rs = await res.json();
    console.log(rs);
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
      message: '',
      file: '',
      fileName: 'FileName....',
      filePreviewSrc: '',
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
    },
    methods: {
      isImageFile(mimeType) {
        return mimeType.startsWith('image/');
      },
      isTextFile(mimeType) {
        return (
          mimeType === 'application/pdf' ||
          mimeType === 'text/plain' ||
          mimeType ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          mimeType === 'application/vnd.ms-excel' ||
          mimeType === 'application/octet-stream'
        );
      },
      isVideoFile(mimeType) {
        return mimeType.startsWith('video/');
      },
      isLink(text) {
        const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        return urlPattern.test(text);
      },
      async postMessageToServer() {
        const currentConversation = document
          .getElementById('conversationId')
          .getAttribute('value');
        const receiver = document
          .getElementById('receiver')
          .getAttribute('value');
        try {
          const message = this.message;
          const formData = new FormData();
          formData.append('message', message);
          formData.append('currentConversation', currentConversation);
          formData.append('receiver', receiver);
          // Add more data properties as needed
          // Assuming you have a fileInputRef to reference the file input element
          const response = await axios.post(
            '/admin/conversations/send/' + receiver,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          );

          // Clear form fields or update UI as needed
          this.message = '';
          this.fileName = 'FileName....';
          this.filePreviewSrc = '';
          return response.data;
          // Optionally, you can update the UI to show a success message, etc.
        } catch (error) {
          // Handle errors
          console.error('Error sending message:', error);
          // Optionally, update the UI to show an error message
        }
      },
      async postMessages(event) {
        const chatMessage = event.target.value;
        const chat = {
          attachments: '',
          message: chatMessage,
          from: '',
          created_time: '',
        };

        const sendMessage = await this.postMessageToServer();
        console.log('HUH');
        console.log(sendMessage);
        if (sendMessage) {
          axios.post('/message', chat).then((data) => {
            console.log(data);
          });
          return;
        }
        window.alert('error');
      },
      handleFileUpload(event) {
        const fileInput = event.target;
        this.file = fileInput;
        this.fileName = fileInput.files[0].name;

        // You can implement file preview logic here if needed
        // For example, display an image preview for image files
        if (this.isImageFile(fileInput.files[0].type)) {
          const reader = new FileReader();
          reader.onload = (e) => {
            console.log(e);
            this.filePreviewSrc = e.target.result;
            document.getElementById('filePreview').style.display = 'block';
          };
          reader.readAsDataURL(fileInput.files[0]);
        }
      },
    },
  });
});
