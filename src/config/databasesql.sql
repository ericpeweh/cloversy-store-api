/*
 Navicat Premium Data Transfer

 Source Server         : utama
 Source Server Type    : PostgreSQL
 Source Server Version : 140002
 Source Host           : localhost:5432
 Source Catalog        : cloversy_store
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 140002
 File Encoding         : 65001

 Date: 27/03/2023 14:41:58
*/


-- ----------------------------
-- Sequence structure for address_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."address_id_seq";
CREATE SEQUENCE "public"."address_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for brand_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."brand_id_seq";
CREATE SEQUENCE "public"."brand_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for cart_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."cart_id_seq";
CREATE SEQUENCE "public"."cart_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for category_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."category_id_seq";
CREATE SEQUENCE "public"."category_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for contact_us_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."contact_us_id_seq";
CREATE SEQUENCE "public"."contact_us_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for conversations_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."conversations_id_seq";
CREATE SEQUENCE "public"."conversations_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for conversations_users_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."conversations_users_id_seq";
CREATE SEQUENCE "public"."conversations_users_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for email_marketing_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."email_marketing_id_seq";
CREATE SEQUENCE "public"."email_marketing_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for email_marketing_target_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."email_marketing_target_id_seq";
CREATE SEQUENCE "public"."email_marketing_target_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for email_subscription_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."email_subscription_id_seq";
CREATE SEQUENCE "public"."email_subscription_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for messages_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."messages_id_seq";
CREATE SEQUENCE "public"."messages_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for notification_category_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."notification_category_id_seq";
CREATE SEQUENCE "public"."notification_category_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for notification_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."notification_id_seq";
CREATE SEQUENCE "public"."notification_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for notification_marketing_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."notification_marketing_id_seq";
CREATE SEQUENCE "public"."notification_marketing_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for notification_marketing_target_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."notification_marketing_target_id_seq";
CREATE SEQUENCE "public"."notification_marketing_target_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for notification_read_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."notification_read_id_seq";
CREATE SEQUENCE "public"."notification_read_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for notification_subscription_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."notification_subscription_id_seq";
CREATE SEQUENCE "public"."notification_subscription_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for offers_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."offers_id_seq";
CREATE SEQUENCE "public"."offers_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for pgmigrations_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."pgmigrations_id_seq";
CREATE SEQUENCE "public"."pgmigrations_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for product_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."product_id_seq";
CREATE SEQUENCE "public"."product_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for product_image_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."product_image_id_seq";
CREATE SEQUENCE "public"."product_image_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for product_last_seen_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."product_last_seen_id_seq";
CREATE SEQUENCE "public"."product_last_seen_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for product_size_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."product_size_id_seq";
CREATE SEQUENCE "public"."product_size_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for product_tag_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."product_tag_id_seq";
CREATE SEQUENCE "public"."product_tag_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for review_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."review_id_seq";
CREATE SEQUENCE "public"."review_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for transactions_item_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."transactions_item_id_seq";
CREATE SEQUENCE "public"."transactions_item_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for users_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."users_id_seq";
CREATE SEQUENCE "public"."users_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for voucher_analytics_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."voucher_analytics_id_seq";
CREATE SEQUENCE "public"."voucher_analytics_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for voucher_dist_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."voucher_dist_id_seq";
CREATE SEQUENCE "public"."voucher_dist_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for wishlist_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."wishlist_id_seq";
CREATE SEQUENCE "public"."wishlist_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS "public"."address";
CREATE TABLE "public"."address" (
  "id" int4 NOT NULL DEFAULT nextval('address_id_seq'::regclass),
  "user_id" int4 NOT NULL,
  "recipient_name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "contact" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
  "address" text COLLATE "pg_catalog"."default" NOT NULL,
  "is_default" bool NOT NULL DEFAULT false,
  "province" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "province_id" int4 NOT NULL,
  "city" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "city_id" int4 NOT NULL,
  "subdistrict" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "subdistrict_id" int4 NOT NULL,
  "postal_code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "label" varchar(100) COLLATE "pg_catalog"."default",
  "shipping_note" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of address
-- ----------------------------

-- ----------------------------
-- Table structure for brand
-- ----------------------------
DROP TABLE IF EXISTS "public"."brand";
CREATE TABLE "public"."brand" (
  "id" int4 NOT NULL DEFAULT nextval('brand_id_seq'::regclass),
  "name" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "identifier" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "modified_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of brand
-- ----------------------------

-- ----------------------------
-- Table structure for cart
-- ----------------------------
DROP TABLE IF EXISTS "public"."cart";
CREATE TABLE "public"."cart" (
  "id" int4 NOT NULL DEFAULT nextval('cart_id_seq'::regclass),
  "user_id" int4 NOT NULL,
  "product_id" int4 NOT NULL,
  "size" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "quantity" int4 NOT NULL
)
;

-- ----------------------------
-- Records of cart
-- ----------------------------

-- ----------------------------
-- Table structure for cart_session
-- ----------------------------
DROP TABLE IF EXISTS "public"."cart_session";
CREATE TABLE "public"."cart_session" (
  "sid" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
;

-- ----------------------------
-- Records of cart_session
-- ----------------------------

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS "public"."category";
CREATE TABLE "public"."category" (
  "id" int4 NOT NULL DEFAULT nextval('category_id_seq'::regclass),
  "name" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "identifier" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "modified_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of category
-- ----------------------------

-- ----------------------------
-- Table structure for contact_us
-- ----------------------------
DROP TABLE IF EXISTS "public"."contact_us";
CREATE TABLE "public"."contact_us" (
  "id" int4 NOT NULL DEFAULT nextval('contact_us_id_seq'::regclass),
  "sender_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "email" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "objective" varchar(30) COLLATE "pg_catalog"."default" NOT NULL,
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "message" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of contact_us
-- ----------------------------

-- ----------------------------
-- Table structure for conversations
-- ----------------------------
DROP TABLE IF EXISTS "public"."conversations";
CREATE TABLE "public"."conversations" (
  "id" int4 NOT NULL DEFAULT nextval('conversations_id_seq'::regclass),
  "title" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "created_by" int4 NOT NULL,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of conversations
-- ----------------------------

-- ----------------------------
-- Table structure for conversations_users
-- ----------------------------
DROP TABLE IF EXISTS "public"."conversations_users";
CREATE TABLE "public"."conversations_users" (
  "id" int4 NOT NULL DEFAULT nextval('conversations_users_id_seq'::regclass),
  "conversation_id" int4 NOT NULL,
  "user_id" int4 NOT NULL,
  "read_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of conversations_users
-- ----------------------------

-- ----------------------------
-- Table structure for email_marketing
-- ----------------------------
DROP TABLE IF EXISTS "public"."email_marketing";
CREATE TABLE "public"."email_marketing" (
  "id" int4 NOT NULL DEFAULT nextval('email_marketing_id_seq'::regclass),
  "notification_code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "sent_at" timestamp(6),
  "scheduled" timestamp(6),
  "description" text COLLATE "pg_catalog"."default",
  "email_subject" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "send_to" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "canceled" bool NOT NULL DEFAULT false,
  "params" jsonb,
  "success_count" int4,
  "failure_count" int4,
  "template_id" int4 NOT NULL,
  "failed_emails" jsonb,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of email_marketing
-- ----------------------------

-- ----------------------------
-- Table structure for email_marketing_target
-- ----------------------------
DROP TABLE IF EXISTS "public"."email_marketing_target";
CREATE TABLE "public"."email_marketing_target" (
  "id" int4 NOT NULL DEFAULT nextval('email_marketing_target_id_seq'::regclass),
  "email_marketing_id" int4 NOT NULL,
  "user_id" int4 NOT NULL
)
;

-- ----------------------------
-- Records of email_marketing_target
-- ----------------------------

-- ----------------------------
-- Table structure for email_subscription
-- ----------------------------
DROP TABLE IF EXISTS "public"."email_subscription";
CREATE TABLE "public"."email_subscription" (
  "id" int4 NOT NULL DEFAULT nextval('email_subscription_id_seq'::regclass),
  "email" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "subscription_date" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of email_subscription
-- ----------------------------

-- ----------------------------
-- Table structure for messages
-- ----------------------------
DROP TABLE IF EXISTS "public"."messages";
CREATE TABLE "public"."messages" (
  "id" int4 NOT NULL DEFAULT nextval('messages_id_seq'::regclass),
  "conversation_id" int4 NOT NULL,
  "body" text COLLATE "pg_catalog"."default" NOT NULL,
  "sender_id" int4 NOT NULL,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of messages
-- ----------------------------

-- ----------------------------
-- Table structure for notification
-- ----------------------------
DROP TABLE IF EXISTS "public"."notification";
CREATE TABLE "public"."notification" (
  "id" int4 NOT NULL DEFAULT nextval('notification_id_seq'::regclass),
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default" NOT NULL,
  "user_id" int4,
  "category_id" int4 NOT NULL,
  "action_link" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of notification
-- ----------------------------

-- ----------------------------
-- Table structure for notification_category
-- ----------------------------
DROP TABLE IF EXISTS "public"."notification_category";
CREATE TABLE "public"."notification_category" (
  "id" int4 NOT NULL DEFAULT nextval('notification_category_id_seq'::regclass),
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of notification_category
-- ----------------------------
INSERT INTO "public"."notification_category" VALUES (1, 'transaction');
INSERT INTO "public"."notification_category" VALUES (2, 'marketing');
INSERT INTO "public"."notification_category" VALUES (3, 'message');
INSERT INTO "public"."notification_category" VALUES (4, 'system');

-- ----------------------------
-- Table structure for notification_marketing
-- ----------------------------
DROP TABLE IF EXISTS "public"."notification_marketing";
CREATE TABLE "public"."notification_marketing" (
  "id" int4 NOT NULL DEFAULT nextval('notification_marketing_id_seq'::regclass),
  "notification_code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "sent_at" timestamp(6),
  "send_to" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "scheduled" timestamp(6),
  "description" text COLLATE "pg_catalog"."default",
  "message_title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "message_body" text COLLATE "pg_catalog"."default" NOT NULL,
  "image_url" text COLLATE "pg_catalog"."default",
  "action_link" varchar(255) COLLATE "pg_catalog"."default",
  "action_title" varchar(255) COLLATE "pg_catalog"."default",
  "success_count" int4,
  "failure_count" int4,
  "canceled" bool NOT NULL DEFAULT false,
  "deeplink_url" varchar(255) COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of notification_marketing
-- ----------------------------

-- ----------------------------
-- Table structure for notification_marketing_target
-- ----------------------------
DROP TABLE IF EXISTS "public"."notification_marketing_target";
CREATE TABLE "public"."notification_marketing_target" (
  "id" int4 NOT NULL DEFAULT nextval('notification_marketing_target_id_seq'::regclass),
  "notification_marketing_id" int4 NOT NULL,
  "user_id" int4 NOT NULL,
  "token" text COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of notification_marketing_target
-- ----------------------------

-- ----------------------------
-- Table structure for notification_read
-- ----------------------------
DROP TABLE IF EXISTS "public"."notification_read";
CREATE TABLE "public"."notification_read" (
  "id" int4 NOT NULL DEFAULT nextval('notification_read_id_seq'::regclass),
  "user_id" int4 NOT NULL,
  "notification_id" int4 NOT NULL,
  "is_read" bool NOT NULL DEFAULT false
)
;

-- ----------------------------
-- Records of notification_read
-- ----------------------------

-- ----------------------------
-- Table structure for notification_subscription
-- ----------------------------
DROP TABLE IF EXISTS "public"."notification_subscription";
CREATE TABLE "public"."notification_subscription" (
  "id" int4 NOT NULL DEFAULT nextval('notification_subscription_id_seq'::regclass),
  "token" text COLLATE "pg_catalog"."default" NOT NULL,
  "user_id" int4 NOT NULL,
  "last_online" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of notification_subscription
-- ----------------------------

-- ----------------------------
-- Table structure for offers
-- ----------------------------
DROP TABLE IF EXISTS "public"."offers";
CREATE TABLE "public"."offers" (
  "id" int4 NOT NULL DEFAULT nextval('offers_id_seq'::regclass),
  "user_id" int4 NOT NULL,
  "offer_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of offers
-- ----------------------------

-- ----------------------------
-- Table structure for pgmigrations
-- ----------------------------
DROP TABLE IF EXISTS "public"."pgmigrations";
CREATE TABLE "public"."pgmigrations" (
  "id" int4 NOT NULL DEFAULT nextval('pgmigrations_id_seq'::regclass),
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "run_on" timestamp(6) NOT NULL
)
;

-- ----------------------------
-- Records of pgmigrations
-- ----------------------------
INSERT INTO "public"."pgmigrations" VALUES (1, '1679735185544_create-table-product', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (2, '1679745043784_create-table-product-image', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (3, '1679745395135_create-table-product-size', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (4, '1679745671872_create-table-product-tag', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (5, '1679745862114_create-table-category', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (6, '1679746014417_create-table-brand', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (7, '1679747060460_create-table-review', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (8, '1679747544128_create-table-transactions', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (9, '1679811810339_create-table-transactions-shipping', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (10, '1679850193571_create-table-transactions-payment', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (11, '1679850340842_create-table-transactions-item', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (12, '1679850627751_create-table-transactions-timeline', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (13, '1679850784570_create-table-users', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (14, '1679851105459_create-table-product-last-seen', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (15, '1679851241386_create-table-wishlist', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (16, '1679851451611_create-table-address', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (17, '1679851964734_create-table-voucher-dist', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (18, '1679852073131_create-table-voucher', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (19, '1679852454349_create-table-voucher-analytics', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (20, '1679852626939_create-table-cart', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (21, '1679890476648_create-table-notification', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (22, '1679890663343_create-table-notification-category', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (23, '1679890943471_create-table-notification-read', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (24, '1679891144866_create-table-conversations', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (25, '1679891273931_create-table-conversations-users', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (26, '1679891382097_create-table-messages', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (27, '1679891470673_create-table-email-marketing', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (28, '1679891761146_create-table-email-marketing-target', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (29, '1679891919738_create-table-notification-marketing', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (30, '1679892491918_create-table-notification-marketing-target', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (31, '1679892616660_create-table-cart-session', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (32, '1679892963210_create-table-email-subscription', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (33, '1679893086956_create-table-contact-us', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (34, '1679893259213_create-table-notification-subscription', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (35, '1679893376378_create-table-offers', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (36, '1679893594137_add-constraint-to-product-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (37, '1679893890878_add-constraint-to-product-image-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (38, '1679893993552_add-constraint-to-product-size-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (39, '1679894186343_add-constraint-to-product-tag-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (40, '1679894320454_add-constraint-to-review-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (41, '1679894668899_add-constraint-to-transactions-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (42, '1679894793180_add-constraint-to-transactions-shipping-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (43, '1679894874867_add-constraint-to-transactions-payment-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (44, '1679895002345_add-constraint-to-transactions-item-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (45, '1679895247569_add-constraint-to-transactions-timeline-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (46, '1679896644657_add-constraint-to-product-last-seen-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (47, '1679896867549_add-constraint-to-wishlist-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (48, '1679897030215_add-constraint-to-address-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (49, '1679897113079_add-constraint-to-voucher-dist-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (50, '1679897276626_add-constraint-to-voucher-analytics-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (51, '1679897393614_add-constraint-to-cart-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (52, '1679897809235_add-constraint-to-notification-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (53, '1679898138864_add-constraint-to-notification-read-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (54, '1679898252047_add-constraint-to-conversations-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (55, '1679898370766_add-constraint-to-conversations-users-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (56, '1679901718675_add-constraint-to-messages-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (57, '1679901820814_add-constraint-to-email-marketing-target-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (58, '1679901983286_add-constraint-to-notification-marketing-target-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (59, '1679902342109_add-constraint-to-notification-subscription-table', '2023-03-27 14:37:19.825844');
INSERT INTO "public"."pgmigrations" VALUES (60, '1679902477353_add-constraint-to-offers-table', '2023-03-27 14:37:19.825844');

-- ----------------------------
-- Table structure for product
-- ----------------------------
DROP TABLE IF EXISTS "public"."product";
CREATE TABLE "public"."product" (
  "id" int4 NOT NULL DEFAULT nextval('product_id_seq'::regclass),
  "title" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "sku" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "price" numeric(10,2) NOT NULL,
  "status" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "category_id" int4 NOT NULL,
  "brand_id" int4 NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "slug" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "modified_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of product
-- ----------------------------

-- ----------------------------
-- Table structure for product_image
-- ----------------------------
DROP TABLE IF EXISTS "public"."product_image";
CREATE TABLE "public"."product_image" (
  "id" int4 NOT NULL DEFAULT nextval('product_image_id_seq'::regclass),
  "product_id" int4 NOT NULL,
  "url" text COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of product_image
-- ----------------------------

-- ----------------------------
-- Table structure for product_last_seen
-- ----------------------------
DROP TABLE IF EXISTS "public"."product_last_seen";
CREATE TABLE "public"."product_last_seen" (
  "id" int4 NOT NULL DEFAULT nextval('product_last_seen_id_seq'::regclass),
  "user_id" int4 NOT NULL,
  "product_id" int4 NOT NULL,
  "seen_date" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of product_last_seen
-- ----------------------------

-- ----------------------------
-- Table structure for product_size
-- ----------------------------
DROP TABLE IF EXISTS "public"."product_size";
CREATE TABLE "public"."product_size" (
  "id" int4 NOT NULL DEFAULT nextval('product_size_id_seq'::regclass),
  "product_id" int4 NOT NULL,
  "size" varchar(10) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of product_size
-- ----------------------------

-- ----------------------------
-- Table structure for product_tag
-- ----------------------------
DROP TABLE IF EXISTS "public"."product_tag";
CREATE TABLE "public"."product_tag" (
  "id" int4 NOT NULL DEFAULT nextval('product_tag_id_seq'::regclass),
  "product_id" int4 NOT NULL,
  "tag" varchar(50) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of product_tag
-- ----------------------------

-- ----------------------------
-- Table structure for review
-- ----------------------------
DROP TABLE IF EXISTS "public"."review";
CREATE TABLE "public"."review" (
  "id" int4 NOT NULL DEFAULT nextval('review_id_seq'::regclass),
  "product_id" int4 NOT NULL,
  "user_id" int4 NOT NULL,
  "transaction_id" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "rating" int2 NOT NULL,
  "description" text COLLATE "pg_catalog"."default" NOT NULL,
  "status" varchar(10) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'active'::character varying,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of review
-- ----------------------------

-- ----------------------------
-- Table structure for transactions
-- ----------------------------
DROP TABLE IF EXISTS "public"."transactions";
CREATE TABLE "public"."transactions" (
  "id" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "user_id" int4 NOT NULL,
  "order_status" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "order_status_modified" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "order_note" text COLLATE "pg_catalog"."default",
  "gift_note" text COLLATE "pg_catalog"."default",
  "customer_note" text COLLATE "pg_catalog"."default",
  "voucher_code" varchar(10) COLLATE "pg_catalog"."default",
  "is_reviewed" bool,
  "discount_total" numeric(10,2) NOT NULL DEFAULT 0,
  "subtotal" numeric(10,2) NOT NULL,
  "total" numeric(10,2) NOT NULL,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of transactions
-- ----------------------------

-- ----------------------------
-- Table structure for transactions_item
-- ----------------------------
DROP TABLE IF EXISTS "public"."transactions_item";
CREATE TABLE "public"."transactions_item" (
  "id" int4 NOT NULL DEFAULT nextval('transactions_item_id_seq'::regclass),
  "transaction_id" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "product_id" int4 NOT NULL,
  "quantity" int4 NOT NULL,
  "price" numeric(10,2) NOT NULL,
  "product_size" varchar(10) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of transactions_item
-- ----------------------------

-- ----------------------------
-- Table structure for transactions_payment
-- ----------------------------
DROP TABLE IF EXISTS "public"."transactions_payment";
CREATE TABLE "public"."transactions_payment" (
  "transaction_id" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "payment_method" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
  "payment_status" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "payment_status_modified" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of transactions_payment
-- ----------------------------

-- ----------------------------
-- Table structure for transactions_shipping
-- ----------------------------
DROP TABLE IF EXISTS "public"."transactions_shipping";
CREATE TABLE "public"."transactions_shipping" (
  "transaction_id" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "shipping_cost" numeric(10,2) NOT NULL,
  "shipping_courier" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "shipping_service" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "shipping_tracking_code" varchar(255) COLLATE "pg_catalog"."default",
  "shipping_etd" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "recipient_name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "contact" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
  "address" text COLLATE "pg_catalog"."default" NOT NULL,
  "province" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "province_id" int4 NOT NULL,
  "city" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "city_id" int4 NOT NULL,
  "subdistrict" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "subdistrict_id" int4 NOT NULL,
  "postal_code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "label" varchar(100) COLLATE "pg_catalog"."default",
  "shipping_note" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of transactions_shipping
-- ----------------------------

-- ----------------------------
-- Table structure for transactions_timeline
-- ----------------------------
DROP TABLE IF EXISTS "public"."transactions_timeline";
CREATE TABLE "public"."transactions_timeline" (
  "transaction_id" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "timeline_object" jsonb
)
;

-- ----------------------------
-- Records of transactions_timeline
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  "full_name" varchar(100) COLLATE "pg_catalog"."default",
  "email" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "contact" varchar(20) COLLATE "pg_catalog"."default",
  "profile_picture" text COLLATE "pg_catalog"."default",
  "user_status" varchar(50) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'active'::character varying,
  "credits" int4 DEFAULT 0,
  "banned_date" timestamp(6),
  "user_role" varchar(10) COLLATE "pg_catalog"."default" DEFAULT 'user'::character varying,
  "sub" varchar(100) COLLATE "pg_catalog"."default",
  "birth_date" timestamp(6),
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of users
-- ----------------------------

-- ----------------------------
-- Table structure for voucher
-- ----------------------------
DROP TABLE IF EXISTS "public"."voucher";
CREATE TABLE "public"."voucher" (
  "code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "expiry_date" timestamp(6),
  "discount" int4 NOT NULL,
  "discount_type" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
  "status" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
  "usage_limit" int4 DEFAULT 10,
  "current_usage" int4 DEFAULT 0,
  "voucher_scope" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of voucher
-- ----------------------------

-- ----------------------------
-- Table structure for voucher_analytics
-- ----------------------------
DROP TABLE IF EXISTS "public"."voucher_analytics";
CREATE TABLE "public"."voucher_analytics" (
  "id" int4 NOT NULL DEFAULT nextval('voucher_analytics_id_seq'::regclass),
  "voucher_code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "transaction_id" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "discount_total" numeric(10,2) NOT NULL,
  "usage_date" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of voucher_analytics
-- ----------------------------

-- ----------------------------
-- Table structure for voucher_dist
-- ----------------------------
DROP TABLE IF EXISTS "public"."voucher_dist";
CREATE TABLE "public"."voucher_dist" (
  "id" int4 NOT NULL DEFAULT nextval('voucher_dist_id_seq'::regclass),
  "user_id" int4 NOT NULL,
  "voucher_code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of voucher_dist
-- ----------------------------

-- ----------------------------
-- Table structure for wishlist
-- ----------------------------
DROP TABLE IF EXISTS "public"."wishlist";
CREATE TABLE "public"."wishlist" (
  "id" int4 NOT NULL DEFAULT nextval('wishlist_id_seq'::regclass),
  "user_id" int4 NOT NULL,
  "product_id" int4 NOT NULL,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of wishlist
-- ----------------------------

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."address_id_seq"
OWNED BY "public"."address"."id";
SELECT setval('"public"."address_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."brand_id_seq"
OWNED BY "public"."brand"."id";
SELECT setval('"public"."brand_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."cart_id_seq"
OWNED BY "public"."cart"."id";
SELECT setval('"public"."cart_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."category_id_seq"
OWNED BY "public"."category"."id";
SELECT setval('"public"."category_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."contact_us_id_seq"
OWNED BY "public"."contact_us"."id";
SELECT setval('"public"."contact_us_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."conversations_id_seq"
OWNED BY "public"."conversations"."id";
SELECT setval('"public"."conversations_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."conversations_users_id_seq"
OWNED BY "public"."conversations_users"."id";
SELECT setval('"public"."conversations_users_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."email_marketing_id_seq"
OWNED BY "public"."email_marketing"."id";
SELECT setval('"public"."email_marketing_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."email_marketing_target_id_seq"
OWNED BY "public"."email_marketing_target"."id";
SELECT setval('"public"."email_marketing_target_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."email_subscription_id_seq"
OWNED BY "public"."email_subscription"."id";
SELECT setval('"public"."email_subscription_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."messages_id_seq"
OWNED BY "public"."messages"."id";
SELECT setval('"public"."messages_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."notification_category_id_seq"
OWNED BY "public"."notification_category"."id";
SELECT setval('"public"."notification_category_id_seq"', 5, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."notification_id_seq"
OWNED BY "public"."notification"."id";
SELECT setval('"public"."notification_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."notification_marketing_id_seq"
OWNED BY "public"."notification_marketing"."id";
SELECT setval('"public"."notification_marketing_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."notification_marketing_target_id_seq"
OWNED BY "public"."notification_marketing_target"."id";
SELECT setval('"public"."notification_marketing_target_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."notification_read_id_seq"
OWNED BY "public"."notification_read"."id";
SELECT setval('"public"."notification_read_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."notification_subscription_id_seq"
OWNED BY "public"."notification_subscription"."id";
SELECT setval('"public"."notification_subscription_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."offers_id_seq"
OWNED BY "public"."offers"."id";
SELECT setval('"public"."offers_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."pgmigrations_id_seq"
OWNED BY "public"."pgmigrations"."id";
SELECT setval('"public"."pgmigrations_id_seq"', 61, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."product_id_seq"
OWNED BY "public"."product"."id";
SELECT setval('"public"."product_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."product_image_id_seq"
OWNED BY "public"."product_image"."id";
SELECT setval('"public"."product_image_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."product_last_seen_id_seq"
OWNED BY "public"."product_last_seen"."id";
SELECT setval('"public"."product_last_seen_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."product_size_id_seq"
OWNED BY "public"."product_size"."id";
SELECT setval('"public"."product_size_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."product_tag_id_seq"
OWNED BY "public"."product_tag"."id";
SELECT setval('"public"."product_tag_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."review_id_seq"
OWNED BY "public"."review"."id";
SELECT setval('"public"."review_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."transactions_item_id_seq"
OWNED BY "public"."transactions_item"."id";
SELECT setval('"public"."transactions_item_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."users_id_seq"
OWNED BY "public"."users"."id";
SELECT setval('"public"."users_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."voucher_analytics_id_seq"
OWNED BY "public"."voucher_analytics"."id";
SELECT setval('"public"."voucher_analytics_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."voucher_dist_id_seq"
OWNED BY "public"."voucher_dist"."id";
SELECT setval('"public"."voucher_dist_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."wishlist_id_seq"
OWNED BY "public"."wishlist"."id";
SELECT setval('"public"."wishlist_id_seq"', 2, false);

-- ----------------------------
-- Primary Key structure for table address
-- ----------------------------
ALTER TABLE "public"."address" ADD CONSTRAINT "address_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table brand
-- ----------------------------
ALTER TABLE "public"."brand" ADD CONSTRAINT "brand_identifier_key" UNIQUE ("identifier");

-- ----------------------------
-- Primary Key structure for table brand
-- ----------------------------
ALTER TABLE "public"."brand" ADD CONSTRAINT "brand_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table cart
-- ----------------------------
ALTER TABLE "public"."cart" ADD CONSTRAINT "unique_cart.user_id_and_cart.product_id_and_cart.size" UNIQUE ("user_id", "product_id", "size");

-- ----------------------------
-- Primary Key structure for table cart
-- ----------------------------
ALTER TABLE "public"."cart" ADD CONSTRAINT "cart_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table cart_session
-- ----------------------------
CREATE INDEX "IDX_session_expire" ON "public"."cart_session" USING btree (
  "expire" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table cart_session
-- ----------------------------
ALTER TABLE "public"."cart_session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid");

-- ----------------------------
-- Uniques structure for table category
-- ----------------------------
ALTER TABLE "public"."category" ADD CONSTRAINT "category_identifier_key" UNIQUE ("identifier");

-- ----------------------------
-- Primary Key structure for table category
-- ----------------------------
ALTER TABLE "public"."category" ADD CONSTRAINT "category_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table contact_us
-- ----------------------------
ALTER TABLE "public"."contact_us" ADD CONSTRAINT "contact_us_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table conversations
-- ----------------------------
ALTER TABLE "public"."conversations" ADD CONSTRAINT "unique_conversations.title_and_conversations.created_by" UNIQUE ("title", "created_by");

-- ----------------------------
-- Primary Key structure for table conversations
-- ----------------------------
ALTER TABLE "public"."conversations" ADD CONSTRAINT "conversations_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table conversations_users
-- ----------------------------
ALTER TABLE "public"."conversations_users" ADD CONSTRAINT "unique_conversations_users.user_id_and_conversations_users.conv" UNIQUE ("user_id", "conversation_id");

-- ----------------------------
-- Primary Key structure for table conversations_users
-- ----------------------------
ALTER TABLE "public"."conversations_users" ADD CONSTRAINT "conversations_users_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table email_marketing
-- ----------------------------
ALTER TABLE "public"."email_marketing" ADD CONSTRAINT "email_marketing_notification_code_key" UNIQUE ("notification_code");

-- ----------------------------
-- Primary Key structure for table email_marketing
-- ----------------------------
ALTER TABLE "public"."email_marketing" ADD CONSTRAINT "email_marketing_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table email_marketing_target
-- ----------------------------
ALTER TABLE "public"."email_marketing_target" ADD CONSTRAINT "unique_email_marketing_target.email_marketing_id_and_email_mark" UNIQUE ("email_marketing_id", "user_id");

-- ----------------------------
-- Primary Key structure for table email_marketing_target
-- ----------------------------
ALTER TABLE "public"."email_marketing_target" ADD CONSTRAINT "email_marketing_target_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table email_subscription
-- ----------------------------
ALTER TABLE "public"."email_subscription" ADD CONSTRAINT "email_subscription_email_key" UNIQUE ("email");

-- ----------------------------
-- Primary Key structure for table email_subscription
-- ----------------------------
ALTER TABLE "public"."email_subscription" ADD CONSTRAINT "email_subscription_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table messages
-- ----------------------------
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table notification
-- ----------------------------
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table notification_category
-- ----------------------------
ALTER TABLE "public"."notification_category" ADD CONSTRAINT "notification_category_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table notification_marketing
-- ----------------------------
ALTER TABLE "public"."notification_marketing" ADD CONSTRAINT "notification_marketing_notification_code_key" UNIQUE ("notification_code");

-- ----------------------------
-- Primary Key structure for table notification_marketing
-- ----------------------------
ALTER TABLE "public"."notification_marketing" ADD CONSTRAINT "notification_marketing_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table notification_marketing_target
-- ----------------------------
ALTER TABLE "public"."notification_marketing_target" ADD CONSTRAINT "unique_notification_marketing_target.notification_marketing_id_" UNIQUE ("notification_marketing_id", "user_id", "token");

-- ----------------------------
-- Primary Key structure for table notification_marketing_target
-- ----------------------------
ALTER TABLE "public"."notification_marketing_target" ADD CONSTRAINT "notification_marketing_target_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table notification_read
-- ----------------------------
ALTER TABLE "public"."notification_read" ADD CONSTRAINT "notification_read_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table notification_subscription
-- ----------------------------
ALTER TABLE "public"."notification_subscription" ADD CONSTRAINT "notification_subscription_token_key" UNIQUE ("token");

-- ----------------------------
-- Primary Key structure for table notification_subscription
-- ----------------------------
ALTER TABLE "public"."notification_subscription" ADD CONSTRAINT "notification_subscription_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table offers
-- ----------------------------
ALTER TABLE "public"."offers" ADD CONSTRAINT "offers_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table pgmigrations
-- ----------------------------
ALTER TABLE "public"."pgmigrations" ADD CONSTRAINT "pgmigrations_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table product
-- ----------------------------
ALTER TABLE "public"."product" ADD CONSTRAINT "product_slug_key" UNIQUE ("slug");

-- ----------------------------
-- Primary Key structure for table product
-- ----------------------------
ALTER TABLE "public"."product" ADD CONSTRAINT "product_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table product_image
-- ----------------------------
ALTER TABLE "public"."product_image" ADD CONSTRAINT "product_image_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table product_last_seen
-- ----------------------------
ALTER TABLE "public"."product_last_seen" ADD CONSTRAINT "unique_product_last_seen.user_id_and_product_last_seen.product_" UNIQUE ("user_id", "product_id");

-- ----------------------------
-- Primary Key structure for table product_last_seen
-- ----------------------------
ALTER TABLE "public"."product_last_seen" ADD CONSTRAINT "product_last_seen_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table product_size
-- ----------------------------
ALTER TABLE "public"."product_size" ADD CONSTRAINT "unique_product_size.product_id_and_product_size.size" UNIQUE ("product_id", "size");

-- ----------------------------
-- Primary Key structure for table product_size
-- ----------------------------
ALTER TABLE "public"."product_size" ADD CONSTRAINT "product_size_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table product_tag
-- ----------------------------
ALTER TABLE "public"."product_tag" ADD CONSTRAINT "unique_product_tag.product_id_and_product_tag.tag" UNIQUE ("product_id", "tag");

-- ----------------------------
-- Primary Key structure for table product_tag
-- ----------------------------
ALTER TABLE "public"."product_tag" ADD CONSTRAINT "product_tag_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table review
-- ----------------------------
ALTER TABLE "public"."review" ADD CONSTRAINT "unique_review.product_id_and_review.user_id_and_review.transact" UNIQUE ("product_id", "user_id", "transaction_id");

-- ----------------------------
-- Checks structure for table review
-- ----------------------------
ALTER TABLE "public"."review" ADD CONSTRAINT "review_rating_check" CHECK (rating >= 1 AND rating <= 10);

-- ----------------------------
-- Primary Key structure for table review
-- ----------------------------
ALTER TABLE "public"."review" ADD CONSTRAINT "review_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table transactions
-- ----------------------------
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table transactions_item
-- ----------------------------
ALTER TABLE "public"."transactions_item" ADD CONSTRAINT "unique_transactions_item.transaction_id_and_transactions_item.p" UNIQUE ("transaction_id", "product_id", "product_size");

-- ----------------------------
-- Primary Key structure for table transactions_item
-- ----------------------------
ALTER TABLE "public"."transactions_item" ADD CONSTRAINT "transactions_item_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table transactions_payment
-- ----------------------------
ALTER TABLE "public"."transactions_payment" ADD CONSTRAINT "transactions_payment_pkey" PRIMARY KEY ("transaction_id");

-- ----------------------------
-- Primary Key structure for table transactions_shipping
-- ----------------------------
ALTER TABLE "public"."transactions_shipping" ADD CONSTRAINT "transactions_shipping_pkey" PRIMARY KEY ("transaction_id");

-- ----------------------------
-- Uniques structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_sub_key" UNIQUE ("sub");

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table voucher
-- ----------------------------
ALTER TABLE "public"."voucher" ADD CONSTRAINT "voucher_pkey" PRIMARY KEY ("code");

-- ----------------------------
-- Uniques structure for table voucher_analytics
-- ----------------------------
ALTER TABLE "public"."voucher_analytics" ADD CONSTRAINT "voucher_analytics_transaction_id_key" UNIQUE ("transaction_id");

-- ----------------------------
-- Primary Key structure for table voucher_analytics
-- ----------------------------
ALTER TABLE "public"."voucher_analytics" ADD CONSTRAINT "voucher_analytics_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table voucher_dist
-- ----------------------------
ALTER TABLE "public"."voucher_dist" ADD CONSTRAINT "unique_voucher_dist.user_id_and_voucher_dist.voucher_code" UNIQUE ("user_id", "voucher_code");

-- ----------------------------
-- Primary Key structure for table voucher_dist
-- ----------------------------
ALTER TABLE "public"."voucher_dist" ADD CONSTRAINT "voucher_dist_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table wishlist
-- ----------------------------
ALTER TABLE "public"."wishlist" ADD CONSTRAINT "unique_wishlist.user_id_and_wishlist.product_id" UNIQUE ("user_id", "product_id");

-- ----------------------------
-- Primary Key structure for table wishlist
-- ----------------------------
ALTER TABLE "public"."wishlist" ADD CONSTRAINT "wishlist_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table address
-- ----------------------------
ALTER TABLE "public"."address" ADD CONSTRAINT "fk_address.user_id_and_users.id" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table cart
-- ----------------------------
ALTER TABLE "public"."cart" ADD CONSTRAINT "fk_cart.product_id_and_product.id" FOREIGN KEY ("product_id") REFERENCES "public"."product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."cart" ADD CONSTRAINT "fk_cart.user_id_and_users.id" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table conversations
-- ----------------------------
ALTER TABLE "public"."conversations" ADD CONSTRAINT "fk_conversations.created_by_and_users.id" FOREIGN KEY ("created_by") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table conversations_users
-- ----------------------------
ALTER TABLE "public"."conversations_users" ADD CONSTRAINT "fk_conversations_users.conversation_id_and_conversations.id" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."conversations_users" ADD CONSTRAINT "fk_conversations_users.user_id_and_users.id" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table email_marketing_target
-- ----------------------------
ALTER TABLE "public"."email_marketing_target" ADD CONSTRAINT "fk_email_marketing_target.email_marketing_id_and_email_marketin" FOREIGN KEY ("email_marketing_id") REFERENCES "public"."email_marketing" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."email_marketing_target" ADD CONSTRAINT "fk_email_marketing_target.user_id_and_users.id" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table messages
-- ----------------------------
ALTER TABLE "public"."messages" ADD CONSTRAINT "fk_messages.conversation_id_and_conversations.id" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."messages" ADD CONSTRAINT "fk_messages.sender_id_and_users.id" FOREIGN KEY ("sender_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table notification
-- ----------------------------
ALTER TABLE "public"."notification" ADD CONSTRAINT "fk_notification.category_id_and_notification_category.id" FOREIGN KEY ("category_id") REFERENCES "public"."notification_category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."notification" ADD CONSTRAINT "fk_notification.user_id_and_users.id" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table notification_marketing_target
-- ----------------------------
ALTER TABLE "public"."notification_marketing_target" ADD CONSTRAINT "fk_notification_marketing_target.notification_marketing_id_and_" FOREIGN KEY ("notification_marketing_id") REFERENCES "public"."notification_marketing" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."notification_marketing_target" ADD CONSTRAINT "fk_notification_marketing_target.user_id_and_users.id" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table notification_read
-- ----------------------------
ALTER TABLE "public"."notification_read" ADD CONSTRAINT "fk_notification.read.user_id_and_users.id" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."notification_read" ADD CONSTRAINT "fk_notification_read.notification_id_and_notification.id" FOREIGN KEY ("notification_id") REFERENCES "public"."notification" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table notification_subscription
-- ----------------------------
ALTER TABLE "public"."notification_subscription" ADD CONSTRAINT "fk_notification_subscription.user_id_and_users.id" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table offers
-- ----------------------------
ALTER TABLE "public"."offers" ADD CONSTRAINT "fk_offers.user_id_and_users.id" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table product
-- ----------------------------
ALTER TABLE "public"."product" ADD CONSTRAINT "fk_product.brand_id_and_brand.id" FOREIGN KEY ("brand_id") REFERENCES "public"."brand" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."product" ADD CONSTRAINT "fk_product.category_id_and_category.id" FOREIGN KEY ("category_id") REFERENCES "public"."category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table product_image
-- ----------------------------
ALTER TABLE "public"."product_image" ADD CONSTRAINT "fk_product_image.product_id_and_product.id" FOREIGN KEY ("product_id") REFERENCES "public"."product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table product_last_seen
-- ----------------------------
ALTER TABLE "public"."product_last_seen" ADD CONSTRAINT "fk_product_last_seen.product_id_and_product.id" FOREIGN KEY ("product_id") REFERENCES "public"."product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."product_last_seen" ADD CONSTRAINT "fk_product_last_seen.user_id_and_users.id" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table product_size
-- ----------------------------
ALTER TABLE "public"."product_size" ADD CONSTRAINT "fk_product_size.product_id_and_product.id" FOREIGN KEY ("product_id") REFERENCES "public"."product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table product_tag
-- ----------------------------
ALTER TABLE "public"."product_tag" ADD CONSTRAINT "fk_product_tag.product_id_and_product.id" FOREIGN KEY ("product_id") REFERENCES "public"."product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table review
-- ----------------------------
ALTER TABLE "public"."review" ADD CONSTRAINT "fk_review.product_id_and_product.id" FOREIGN KEY ("product_id") REFERENCES "public"."product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."review" ADD CONSTRAINT "fk_review.transaction_id_and_transactions.id" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."review" ADD CONSTRAINT "fk_review.user_id_and_users.id" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table transactions
-- ----------------------------
ALTER TABLE "public"."transactions" ADD CONSTRAINT "fk_transactions.user_id_and_users.id" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."transactions" ADD CONSTRAINT "fk_transactions.voucher_code_and_voucher.code" FOREIGN KEY ("voucher_code") REFERENCES "public"."voucher" ("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table transactions_item
-- ----------------------------
ALTER TABLE "public"."transactions_item" ADD CONSTRAINT "fk_transactions_item.product_id_and_product.id" FOREIGN KEY ("product_id") REFERENCES "public"."product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."transactions_item" ADD CONSTRAINT "fk_transactions_item.transaction_id_and_transactions.id" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table transactions_payment
-- ----------------------------
ALTER TABLE "public"."transactions_payment" ADD CONSTRAINT "fk_transactions_payment.transaction_id_and_transactions.id" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table transactions_shipping
-- ----------------------------
ALTER TABLE "public"."transactions_shipping" ADD CONSTRAINT "fk_transactions_shipping.transaction_id_and_transactions.id" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table transactions_timeline
-- ----------------------------
ALTER TABLE "public"."transactions_timeline" ADD CONSTRAINT "fk_transactions_timeline.transaction_id_and_transactions.id" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table voucher_analytics
-- ----------------------------
ALTER TABLE "public"."voucher_analytics" ADD CONSTRAINT "fk_voucher_analytics.transaction_id_and_transactions.id" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."voucher_analytics" ADD CONSTRAINT "fk_voucher_analytics.voucher_code_and_voucher.code" FOREIGN KEY ("voucher_code") REFERENCES "public"."voucher" ("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table voucher_dist
-- ----------------------------
ALTER TABLE "public"."voucher_dist" ADD CONSTRAINT "fk_voucher_dist.user_id_and_users.id" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."voucher_dist" ADD CONSTRAINT "fk_voucher_dist.voucher_code_and_voucher.code" FOREIGN KEY ("voucher_code") REFERENCES "public"."voucher" ("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table wishlist
-- ----------------------------
ALTER TABLE "public"."wishlist" ADD CONSTRAINT "fk_wishlist.product_id_and_product.id" FOREIGN KEY ("product_id") REFERENCES "public"."product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."wishlist" ADD CONSTRAINT "fk_wishlist.user_id_and_users.id" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
