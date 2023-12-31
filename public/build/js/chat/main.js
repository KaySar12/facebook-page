const SAD_EMOJI = [55357, 56864];
const HAPPY_EMOJI = [55357, 56832];
const NEUTRAL_EMOJI = [55357, 56848];

new Vue({
  el: '#app',
  data: {
    chats: [],
    username: '',
    mood: '',
  },
  created() {
    console.log('in chat');
    let pusher = new Pusher('6733a2156ab8670aa489', {
      cluster: 'ap1',
      useTLS: true,
    });

    const channel = pusher.subscribe('chats');
    channel.bind('new-chat', (data) => {
      const expression =
        data.sentiment > 0
          ? HAPPY_EMOJI
          : data.sentiment === 0
          ? NEUTRAL_EMOJI
          : SAD_EMOJI;

      const response = {
        message: data.message,
        user: data.user,
        mood: String.fromCodePoint(...expression),
      };

      this.chats.push(response);
    });
  },
  methods: {
    getUser(event) {
      this.username = event.target.value;
        console.log(`get user name ${event.target.value}`);
    },

    postMessages(event) {
      const chatMessage = event.target.value;

      if (event.keyCode === 13 && !event.shiftKey) {
        const chat = {
          user: this.username,
          message: chatMessage,
        };

        event.target.value = '';

        axios.post('/message', chat).then((data) => {
          console.log(data);
        });
      }
    },
  },
});
