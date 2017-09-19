CREATE TABLE `ip` (
  `ipNo` int(11) unsigned NOT NULL,
  `ipStart` varchar(255) NOT NULL DEFAULT '',
  `ipEnd` varchar(255) NOT NULL DEFAULT '',
  `place` varchar(255) NOT NULL DEFAULT '',
  `attribution` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`ipNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;