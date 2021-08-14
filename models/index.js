const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const DiaryRoom = require('./diaryRoom');
const DiaryContent = require('./diaryContent');
const Member = require('./member');
const Bookmark = require('./bookmark');
const Notice = require('./notice');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.DiaryRoom = DiaryRoom;
db.DiaryContent = DiaryContent;
db.Member = Member;
db.Bookmark = Bookmark;
db.Notice = Notice;

User.init(sequelize);
DiaryRoom.init(sequelize);
DiaryContent.init(sequelize);
Member.init(sequelize);
Bookmark.init(sequelize);
Notice.init(sequelize);

User.associate(db);
DiaryRoom.associate(db);
DiaryContent.associate(db);
Member.associate(db);
Bookmark.associate(db);
Notice.associate(db);

module.exports = db;
