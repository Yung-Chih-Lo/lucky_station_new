CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pick_id` integer NOT NULL,
	`station_id` integer NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`pick_id`) REFERENCES `station_picks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`station_id`) REFERENCES `stations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_comments_station_id` ON `comments` (`station_id`);--> statement-breakpoint
CREATE INDEX `idx_comments_created_at` ON `comments` (`created_at`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`ip` text NOT NULL,
	`window_start` text NOT NULL,
	`scope` text NOT NULL,
	`count` integer DEFAULT 1 NOT NULL,
	PRIMARY KEY(`ip`, `window_start`, `scope`),
	CONSTRAINT "rate_limits_scope_check" CHECK("rate_limits"."scope" IN ('pick','comment'))
);
--> statement-breakpoint
CREATE INDEX `idx_rate_limits_window` ON `rate_limits` (`window_start`);--> statement-breakpoint
CREATE TABLE `station_picks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`station_id` integer NOT NULL,
	`transport_type` text NOT NULL,
	`token` text NOT NULL,
	`picked_at` integer NOT NULL,
	`comment_used` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`station_id`) REFERENCES `stations`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "station_picks_transport_type_check" CHECK("station_picks"."transport_type" IN ('mrt','tra'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_station_picks_token` ON `station_picks` (`token`);--> statement-breakpoint
CREATE INDEX `idx_station_picks_station_id` ON `station_picks` (`station_id`);--> statement-breakpoint
CREATE INDEX `idx_station_picks_transport_type` ON `station_picks` (`transport_type`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_stations` (
	`id` integer PRIMARY KEY NOT NULL,
	`transport_type` text NOT NULL,
	`name_zh` text NOT NULL,
	`name_en` text,
	`county` text,
	`lat` real,
	`lng` real,
	`schematic_x` real,
	`schematic_y` real,
	`label_x` real,
	`label_y` real,
	`label_anchor` text,
	`updated_at` integer NOT NULL,
	CONSTRAINT "stations_transport_type_check" CHECK("__new_stations"."transport_type" IN ('mrt','tra')),
	CONSTRAINT "stations_label_anchor_check" CHECK("__new_stations"."label_anchor" IS NULL OR "__new_stations"."label_anchor" IN ('start','middle','end'))
);
--> statement-breakpoint
INSERT INTO `__new_stations`("id", "transport_type", "name_zh", "name_en", "county", "lat", "lng", "schematic_x", "schematic_y", "label_x", "label_y", "label_anchor", "updated_at") SELECT "id", 'mrt', "name_zh", "name_en", NULL, "lat", "lng", "schematic_x", "schematic_y", "label_x", "label_y", "label_anchor", "updated_at" FROM `stations`;--> statement-breakpoint
DROP TABLE `stations`;--> statement-breakpoint
ALTER TABLE `__new_stations` RENAME TO `stations`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `uniq_mrt_name` ON `stations` (`name_zh`) WHERE "stations"."transport_type" = 'mrt';--> statement-breakpoint
CREATE UNIQUE INDEX `uniq_tra_name_county` ON `stations` (`name_zh`,`county`) WHERE "stations"."transport_type" = 'tra';--> statement-breakpoint
CREATE TABLE `__new_lines` (
	`code` text PRIMARY KEY NOT NULL,
	`transport_type` text NOT NULL,
	`name_zh` text,
	`name_en` text,
	`color` text NOT NULL,
	CONSTRAINT "lines_transport_type_check" CHECK("__new_lines"."transport_type" IN ('mrt','tra'))
);
--> statement-breakpoint
INSERT INTO `__new_lines`("code", "transport_type", "name_zh", "name_en", "color") SELECT "code", 'mrt', "name_zh", "name_en", "color" FROM `lines`;--> statement-breakpoint
DROP TABLE `lines`;--> statement-breakpoint
ALTER TABLE `__new_lines` RENAME TO `lines`;