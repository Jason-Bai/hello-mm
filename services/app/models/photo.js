const U = require('../lib/utils');
const ModelBase = require('./base');
const photo = require('../lib/photo');

const Sequelize = U.rest.Sequelize;

module.exports = (sequelize) => {
  const Photo = U._.extend(sequelize.define('photo', {
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
    to: {
      type: Sequelize.type('string', 255),
      allowNull: true,
      validate: {
        len: [1, 255],
      },
      comment: '地址',
    },
    path: {
      type: Sequelize.type('string', 255),
      allowNull: true,
      validate: {
        len: [1, 255],
      },
      comment: '真实地址',
    },
    publishedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Date.now(),
      comment: '发布时间',
    },
    popularityCount: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '人气',
    },
    likeCount: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '人气',
    },
    galleryId: {
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
    comment: '图片',
    freezeTableName: true,
    hooks: {},

    instanceMethods: {
      async download() {
        const path = await photo.download(this);
        const updated = {
          path: path || this.to,
        };
        const fields = ['path'];
        await this.update(updated, { fields });
      },
    },

    classMethods: {
      /** 批量更新 **/
      /* eslint no-shadow: 0 */
      async batchUpdateMMJPG(galleryId, photo) {
        const {
          name,
          year,
          month,
          date,
          pages,
          type,
          mId,
          popularityCount,
          likeCount,
        } = photo;

        const batches = pages.map(async (page, index) => {
          const to = `http://img.mmjpg.com/${year}/${mId}/${type === 0 ? page : `${index + 1}i${page}`}.jpg`;

          const hash = U.md5(`${name}${to}`);

          const where = {
            hash,
          };

          const model = await Photo.findOne({ where });

          if (model) {
            const updated = {
              to,
              popularityCount,
              likeCount,
            };

            const updatedWhere = {
              hash,
            };

            const fields = ['popularityCount', 'likeCount', 'to'];

            const updatedModel = await Photo.update(updated, { fields }, { where: updatedWhere });

            return updatedModel;
          }

          const publishedAt = U.moment(`${year}-${month}-${date}`);

          const newModel = {
            name: `${name}${page}`,
            hash,
            to,
            publishedAt,
            popularityCount,
            likeCount,
            galleryId,
          };

          const m = await Photo.create(newModel);

          return m;
        });

        await Promise.all(batches);
      },
    },

  }), ModelBase, {
    unique: ['hash'],
    sort: {
      default: 'createdAt',
      allow: [
        'name', 'galleryId', 'publishedAt',
        'popularityCount', 'likeCount',
        'status', 'updatedAt', 'createdAt',
      ],
    },
    writableCols: [
      'name', 'galleryId', 'publishedAt',
      'popularityCount', 'likeCount', 'to',
      'path', 'status', 'updatedAt', 'createdAt',
    ],
    editableCols: [
      'name', 'path', 'status',
    ],
    /** 只有管理员才可以修改的字段 */
    onlyAdminCols: ['status'],

    /** 定义允许包含返回的字段，不设置为全部 */
    allowIncludeCols: [
      'name', 'to', 'galleryId',
      'popularityCount', 'likeCount', 'path',
      'createdAt',
    ],
  });

  return Photo;
};
