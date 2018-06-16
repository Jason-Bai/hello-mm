const U = require('../lib/utils');
const ModelBase = require('./base');
const Crawler = require('../lib/crawler');

const Sequelize = U.rest.Sequelize;

const eachSeries = U.util.promisify(U.async.eachSeries);

module.exports = (sequelize) => {
  const Gallery = U._.extend(sequelize.define('gallery', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    hash: {
      type: Sequelize.type('string', 128),
      allowNull: false,
      unique: true,
      comment: 'hash值',
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
      comment: '名称',
    },
    type: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['mmjpg', 'nvshens'],
      defaultValue: 'mmjpg',
    },
    cover: {
      type: Sequelize.type('string', 255),
      allowNull: true,
      validate: {
        len: [1, 255],
      },
      comment: '封面',
    },
    publishedAt: {
      type: Sequelize.type('string', 30),
      allowNull: true,
      defaultValue: null,
      comment: '发布时间',
    },
    viewCount: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '浏览量',
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
    siteId: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
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
    comment: '图集',
    freezeTableName: true,
    hooks: {},

    instanceMethods: {
      async updateGallery() {
        const { type } = this;
        const updateKey = `update${type.toUpperCase()}Gallery`;

        await this[updateKey]();
      },

      async updateMMJPGGallery() {
        const { id, type, to, page } = this;

        const photo = await Crawler.getPhoto(to);

        if (photo.page > page) {
          const Photo = U.model('photo');

          await Photo[`batchUpdate${type.toUpperCase()}`](id, photo);

          const updated = {
            page: photo.page,
          };

          await this.update(updated, { fields: ['page'] });
        }
      },
    },

    classMethods: {
      /** 批量更新 **/
      async batchUpdate(siteId, type, galleries) {
        const upsertGallery = async (gallery) => {
          const { name, to, publishedAt, viewCount } = gallery;

          const hash = U.md5(`${name}${to}`);

          const where = {
            hash,
          };

          const model = await Gallery.findOne({ where });

          if (model) {
            const fields = ['publishedAt', 'viewCount'];

            const updated = {
              publishedAt,
              viewCount,
            };

            await model.update(updated, { fields });
          } else {
            gallery.hash = hash;
            gallery.siteId = siteId;
            gallery.type = type;
            await Gallery.create(gallery);
          }

          return true;
        };

        await eachSeries(galleries, upsertGallery);
      },
    },

  }), ModelBase, {
    unique: ['hash'],
    sort: {
      default: 'createdAt',
      allow: ['name', 'type', 'siteId', 'viewCount', 'status', 'updatedAt', 'createdAt'],
    },
    writableCols: [
      'hash', 'name', 'cover', 'publishedAt',
      'viewCount', 'to', 'siteId', 'status',
    ],
    editableCols: [
      'name', 'status',
    ],
    /** 只有管理员才可以修改的字段 */
    onlyAdminCols: ['status'],

    /** 定义允许包含返回的字段，不设置为全部 */
    allowIncludeCols: [
      'hash', 'name', 'cover', 'viewCount',
      'to', 'siteId', 'createdAt',
    ],
  });

  return Gallery;
};
