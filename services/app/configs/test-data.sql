-- user
INSERT INTO `user` (`id`, `name`, `email`, `password`, `salt`, `role`, `isDelete`, `createdAt`, `updatedAt`) VALUES (1, 'baiyu', '602316022@qq.com', '0296d58ee532f6dde7058453ff5205c1', 'YigRivsMpZYHXZis', 'admin', 'no', NOW(), NOW());
-- site
INSERT INTO `site` (`id`, `name`, `type`, `to`, `page`, `creatorId`, `status`, `isDelete`, `createdAt`, `updatedAt`) VALUES (1, '妹子图-性感', 'mmjpg', 'http://www.mmjpg.com/tag/xinggan', 0, 1, 'enabled', 'no', NOW(), NOW());
INSERT INTO `site` (`id`, `name`, `type`, `to`, `page`, `creatorId`, `status`, `isDelete`, `createdAt`, `updatedAt`) VALUES (2, '妹子图-小清新', 'mmjpg', 'http://www.mmjpg.com/tag/xiaoqingxin', 0, 1, 'enabled', 'no', NOW(), NOW());
