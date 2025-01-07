module.exports = {
  hello: () => 'Hello World!',
  notes: async (parent, args, { models }) => {
    // 모든 문서를 검색
    return await models.Note.find();
  },
  note: async (parent, args, { models }) => {
    // 인자로 받은 ID를 사용하여 특정 Note를 찾음
    return await models.Note.findById(args.id);
  },
  user: async (parent, { username }, { models }) => {
    // 인자로 받은 username을 사용하여 특정 User를 찾음
    return await models.User.findOne({ username });
  },
  users: async (parent, args, { models }) => {
    // 모든 문서를 검색
    return await models.User.find({});
  },
  me: async (parent, args, { models, user }) => {
    // context에 user가 있으면 user를 반환
    return await models.User.findById(user.id);
  },
  noteFeed: async (parent, { cursor }, { models }) => {
    const limit = 10; // 한 번에 반환할 노트 수(하드코딩)
    let hasNextPage = false;
    let cursorQuery = {};

    if (cursor) {
      // $lt : 쿼리 연산자(less than) : cursor보다 작은 값
      cursorQuery = { _id: { $lt: cursor } };
    }

    // cursorQuery를 사용해 조건에 맞는 노트를 비동기적으로 찾음
    // _id필드 기준으로 내림차순 정렬(최신 노트가 먼저 오도록) & 최대 limit+1개 반환
    let notes = await models.Note.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limit + 1);

    // 반환된 노트 수가 요청한 노트 수보다 많은지 확인하고 페이지네이션을 처리하는 부분
    // 노트개수가 limit을 넘어가면, hasNextPage를 true로 설정하고 notes 배열을 limit까지 자름
    if (notes.length > limit) {
      hasNextPage = true;
      notes = notes.slice(0, -1); // 노트 배열에서 마지막 노트는 제거
    }

    // 피드 배열 마지막 항목의 몽고 객체 ID
    const newCursor = notes[notes.length - 1]._id;

    return {
      notes,
      cursor: newCursor,
      hasNextPage,
    };
  },
};
