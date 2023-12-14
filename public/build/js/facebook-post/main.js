const deletePost = async (id) => {
  console.log(`delete post ${id.toString()}`);
  try {
    const res = await fetch(`http://localhost:8000/facebook/page/post/${id}`, {
      method: 'GET',
    });
    const rs = await res.json();
    console.log(rs);
  } catch (err) {
    console(err);
  }
};
const getPosts = async () => {
  const res = await fetch('http://localhost:8000/facebook/page/feed', {
    method: 'GET',
    redirect: 'follow',
  });
  const rs = await res.json();
  console.log(rs);
  return rs;
};
const getPostsNext = async (next) => {
  const res = await fetch(`http://localhost:8000/facebook/page/feed/${next}`, {
    method: 'GET',
    redirect: 'follow',
  });
  const rs = await res.json();

  return rs;
};
const getPostsPrev = async (prev) => {
  const res = await fetch(`http://localhost:8000/facebook/page/feed/${prev}`, {
    method: 'GET',
    redirect: 'follow',
  });
  const rs = await res.json();

  return rs;
};

const app = {
  async start() {
    const rs = await getPosts().then((res) => {
      return res;
    });
    console.log('heres');
    console.log(rs.data);
    const dataTable = await $('#realtime').DataTable({
      pagingType: 'simple',
      paging: true,
      data: await rs.data,
      columns: [
        {
          data: 'created_time',
          render: function (data, type, row) {
            if (type === 'sort' || type === 'type') {
              return data;
            }
            return moment(new Date(data).toString()).format('DD/MM/YYYY');
          },
        },
        { data: '-' },
        { data: '-' },
        { data: '-' },
        { data: 'message' },
        { data: '-' },
        { data: '-' },
        {
          render: function (data, type) {
            return `<button class='btn btn-info'><i class='fas fa-info-circle'>edit</button>`;
          },
        },
        {
          render: function (data, type, full, meta) {
            return `<button  onclick=deletePost('${full.id}') class='btn btn-danger'><i class='fas fa-minus-circle'></i>delete</button>`;
          },
        },
      ],
      columnDefs: [
        {
          defaultContent: '-',
          targets: '_all',
        },
      ],
      drawCallback: async function () {
        const api = this.api();
        $('.paginate_button.next', this.api().table().container()).on(
          'click',
          async function () {
            alert('next page');
            const nextData = await getPostsNext(rs.paging.cursors.after);
            api.clear().rows.add(nextData.data).draw();
          },
        );
        $('.paginate_button.previous', this.api().table().container()).on(
          'click',
          async function () {
            alert('prev page');
            const prevPage = await getPostsPrev(rs.paging.cursors.before);
            api.clear().rows.add(prevPage.data).draw();
          },
        );
      },
    });
    let pusher = new Pusher('6733a2156ab8670aa489', {
      cluster: 'ap1',
      useTLS: true,
    });

    let channel = pusher.subscribe('employees');
    channel.bind('new-employee', (data) => {
      this.addRow(dataTable, data);
    });
  },
};

$(document).ready(() => app.start());
