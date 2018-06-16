# photo 去掉viewCount

```
ALTER TABLE `photo` DROP COLUMN `viewCount`;
```

# photo 添加真实path

```
ALTER TABLE `photo` ADD COLUMN `path` varchar(30) NULL DEFAULT '' AFTER `to`;
```
