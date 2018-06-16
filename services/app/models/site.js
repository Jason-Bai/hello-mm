const U = require('../lib/utils');
const ModelBase = require('./base');
const Crawler = require('../lib/crawler');

const Sequelize = U.rest.Sequelize;

const eachLimit = U.util.promisify(U.async.eachLimit);

module.exports = (sequelize) => {
  const Site = U._.extend(sequelize.define('site', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.type('string', 50),
      allowNull: false,
      set(val) {
        this.setDataValue('name', U.nt2space(val));
      },
      validate: {
        len: [2, 50],
      },
      unique: true,
      comment: '名称',
    },
    type: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['mmjpg', 'nvshens'],
      defaultValue: 'mmjpg',
    },
    to: {
      type: Sequelize.type('string', 255),
      allowNull: true,
      defaultValue: null,
      validate: {
        isUrl: true,
      },
      comment: '图集地址',
    },
    page: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '页数',
    },
    status: {
      type: Sequelize.ENUM,
      values: ['disabled', 'enabled'],
      defaultValue: 'enabled',
      allowNull: false,
      comment: '是否可用',
    },
    isDelete: {
      type: Sequelize.ENUM,
      values: ['yes', 'no'],
      defaultValue: 'no',
      allowNull: false,
      comment: '是否被删除',
    },
  }, {
    comment: '站点',
    freezeTableName: true,
    hooks: {},

    instanceMethods: {
      async updateSite() {
        const { type } = this;
        const updateKey = `update${type.toUpperCase()}Site`;
        await this[updateKey]();
      },
      /** 更新妹子图 **/
      async updateMMJPGSite() {
        const { id, to, page } = this;

        const current = await Crawler.getPage(to);

        // 更新
        if (current > page) {
          const pages = U._.range(1, current + 1);

          const Gallery = U.model('gallery');

          const updateGalleries = async (p) => {
            const ms = Math.random() * 5000;
            await U.sleep(ms);
            const galleries = await Crawler.getGalleries(to, p);
            await Gallery.batchUpdate(id, 'mmjpg', galleries);
            return true;
          };

          await eachLimit(pages, 1, updateGalleries);

          const updated = {
            page: current,
          };

          await this.update(updated, { fields: ['page'] });

          process.stdout.write('.');
        }
      },
    },

    classMethods: {},

  }), ModelBase, {
    unique: ['name'],
    sort: {
      default: 'createdAt',
      allow: ['name', 'status', 'updatedAt', 'createdAt'],
    },
    writableCols: [
      'name', 'to', 'status',
    ],
    editableCols: [
      'name', 'to', 'status',
    ],
    /** 只有管理员才可以修改的字段 */
    onlyAdminCols: ['status'],

    /** 定义允许包含返回的字段，不设置为全部 */
    allowIncludeCols: [
      'name', 'to', 'createdAt',
    ],
  });

  return Site;
};
