const U = require('../lib/utils');
const helper = require('./helper');

const Site = U.model('site');
const Gallery = U.model('gallery');

/**
 * @api {GET} /imonlines QQ在线人数列表
 * @apiName config_modify
 * @apiGroup ImOnline
 * @apiPermission admin | member
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *
 *   Body:
 *   [{
 *     id: 1,
 *     date: '2014-09-03T03:15:16.000Z',
 *     current: 268701629,
 *     result: '11629',
 *     createdAt: '2014-09-03T03:15:16.000Z',
 *     updatedAt: '2014-09-03T03:15:16.000Z'
 *   }]
 * @apiVersion 1.0.0
 */
const list = [
  helper.checker.sysAdmin(),
  helper.rest.list(Site),
];

/**
 * @api {PUT/PATCH} /users/:id 编辑用户
 * @apiName user_modify
 * @apiPermission admin | owner
 * @apiGroup User
 * @apiParam (query) {Number} id 用户 ID
 * @apiParam (body) {String} [name] 用户语言设置
 * @apiParam (body) {String} [language] 用户语言设置
 * @apiParam (body) {Enum} [status] 用户状态`disabled` or `enabled` 仅管理员可用
 * @apiParam (body) {Enum} [role] 用户角色，`admin` or `number`, 仅管理员可用
 * @apiParam (body) {String} [password] 设置的新密码
 * @apiParam (body) {String} [origPass] 原密码，在设置新密码的时候必须要携带原始密码
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   Body:
 *   {
 *     id: 2,
 *     name: 'StonePHP',
 *     role: 'member',
 *     avatar: 'users/a2/21/1.png',
 *     email: '269718799@qq.com',
 *     status: 'enabled',
 *     language: 'zh',
 *     isDelete: 'no',
 *     createdAt: '2014-09-03T03:15:16.000Z',
 *     updatedAt: '2014-09-03T03:15:16.000Z'
 *   }
 * @apiVersion 1.0.0
 */
const modify = [
  helper.getter(Site, 'site'),
  helper.assert.exists('hooks.site'),
  helper.checker.sysAdmin(),
  helper.rest.modify(Site, 'site'),
];

/**
 * @api {DELETE} /users/:id 删除用户
 * @apiName user_del
 * @apiPermission admin
 * @apiGroup User
 * @apiParam {Number} id 用户 ID
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 204 No Content
 * @apiVersion 1.0.0
 */
const remove = [
  helper.checker.sysAdmin(),
  helper.getter(Site, 'site'),
  helper.assert.exists('hooks.site'),
  helper.rest.remove.hook('site').exec(),
];

/**
 * @api {GET} /users/:id 查看用户
 * @apiName user_detail
 * @apiPermission admin | owner
 * @apiGroup User
 * @apiParam (query) {Number} id 用户 ID
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   Body:
 *   {
 *     id: 2,
 *     name: 'StonePHP',
 *     role: 'member',
 *     avatar: 'users/a2/21/1.png',
 *     email: '269718799@qq.com',
 *     status: 'enabled',
 *     language: 'zh',
 *     isDelete: 'no',
 *     createdAt: '2014-09-03T03:15:16.000Z',
 *     updatedAt: '2014-09-03T03:15:16.000Z'
 *   }
 * @apiVersion 1.0.0
 */
const detail = [
  helper.getter(Site, 'site'),
  helper.assert.exists('hooks.site'),
  helper.rest.detail('site'),
];

/**
 * @api {POST} /users 添加用户
 * @apiName user_add
 * @apiPermission admin
 * @apiGroup User
 * @apiParam (body) {String} name 用户语言设置
 * @apiParam (body) {String} email Email 地址
 * @apiParam (body) {String} password 密码
 * @apiParam (body) {String} [language] 用户语言设置
 * @apiParam (body) {Enum} [status] 用户状态`disabled` or `enabled`
 * @apiParam (body) {Enum} [role] 用户角色，`admin` or `number`
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 201 Created
 *
 *   Body:
 *   {
 *     id: 2,
 *     name: 'StonePHP',
 *     role: 'member',
 *     avatar: 'users/a2/21/1.png',
 *     email: '269718799@qq.com',
 *     status: 'enabled',
 *     language: 'zh',
 *     isDelete: 'no',
 *     createdAt: '2014-09-03T03:15:16.000Z',
 *     updatedAt: '2014-09-03T03:15:16.000Z'
 *   }
 * @apiVersion 1.0.0
 */
const add = [
  helper.checker.sysAdmin(),
  helper.rest.add(Site),
];

/**
 * @api {GET} /sites/:siteId/gallerys QQ在线人数列表
 * @apiName config_modify
 * @apiGroup ImOnline
 * @apiPermission admin | member
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *
 *   Body:
 *   [{
 *     id: 1,
 *     date: '2014-09-03T03:15:16.000Z',
 *     current: 268701629,
 *     result: '11629',
 *     createdAt: '2014-09-03T03:15:16.000Z',
 *     updatedAt: '2014-09-03T03:15:16.000Z'
 *   }]
 * @apiVersion 1.0.0
 */
const gallerys = [
  helper.getter(Site, 'site', 'params.siteId'),
  helper.assert.exists('hooks.site'),
  helper.checker.sysAdmin(),
  helper.rest.list(Gallery),
];

/**
 * @api {POST} /sites/:siteId/gallerys QQ在线人数列表
 * @apiName config_modify
 * @apiGroup ImOnline
 * @apiPermission admin | member
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *
 *   Body:
 *   [{
 *     id: 1,
 *     date: '2014-09-03T03:15:16.000Z',
 *     current: 268701629,
 *     result: '11629',
 *     createdAt: '2014-09-03T03:15:16.000Z',
 *     updatedAt: '2014-09-03T03:15:16.000Z'
 *   }]
 * @apiVersion 1.0.0
 */
const addGallery = [
  helper.getter(Site, 'site'),
  helper.assert.exists('hooks.site'),
  helper.checker.sysAdmin(),
  helper.rest.add(Gallery),
];


module.exports = { list, modify, remove, detail, add, gallerys, addGallery };
