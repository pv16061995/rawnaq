<?php

use yii\db\Migration;

class m150630_121101_create_hotel_table extends Migration
{
    const HOTEL_TABLE = '{{%hotel}}';
    const HOTEL_LANG_TABLE = '{{%hotel_lang}}';
    const HOTEL_DESTINATION_TABLE = '{{%hotel_destination}}';
    const HOTEL_DESTINATION_LANG_TABLE = '{{%hotel_destination_lang}}';

    public function safeUp()
    {
        $tableOptions = null;
        if ($this->db->driverName === 'mysql') {
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_general_ci ENGINE=InnoDB';
        }

        $this->createTable(self::Hotel_DESTINATION_TABLE, [
            'id' => $this->primaryKey(),
            'slug' => $this->string(200)->notNull(),
            'thumbnail'=> $this->string(255),
            'visible' => $this->integer()->notNull()->defaultValue(1)->comment('0-hidden,1-visible'),
            'created_at' => $this->integer(),
            'updated_at' => $this->integer(),
            'created_by' => $this->integer(),
            'updated_by' => $this->integer(),
            'left_border' => $this->integer()->notNull(),
            'right_border' => $this->integer()->notNull(),
            'depth' => $this->integer()->notNull(),
        ], $tableOptions);

        $this->createIndex('hotel_destination_slug', self::HOTEL_DESTINATION_TABLE, 'slug');
        $this->createIndex('hotel_destination_visible', self::HOTEL_DESTINATION_TABLE, 'visible');
        $this->createIndex('left_border', self::HOTEL_DESTINATION_TABLE, ['left_border', 'right_border']);
        $this->createIndex('right_border', self::HOTEL_DESTINATION_TABLE, ['right_border']);
        $this->addForeignKey('fk_hotel_destination_created_by', self::HOTEL_DESTINATION_TABLE, 'created_by', '{{%user}}', 'id', 'SET NULL', 'CASCADE');
        $this->addForeignKey('fk_hotel_destination_updated_by', self::HOTEL_DESTINATION_TABLE, 'updated_by', '{{%user}}', 'id', 'SET NULL', 'CASCADE');
        $this->insert(self::HOTEL_DESTINATION_TABLE, ['id' => 1, 'slug' => 'root', 'depth' => 0, 'created_at' => time(), 'visible' => 0, 'left_border' => 0, 'right_border' => 2147483647]);

        $this->createTable(self::HOTEL_DESTINATION_LANG_TABLE, [
            'id' => $this->primaryKey(),
            'hotel_destination_id' => $this->integer(),
            'language' => $this->string(6)->notNull(),
            'title' => $this->string(255)->notNull(),
            'description' => $this->text(),
        ], $tableOptions);

        $this->createIndex('hotel_destination_lang_id', self::HOTEL_DESTINATION_LANG_TABLE, 'hotel_destination_id');
        $this->createIndex('hotel_destination_lang_language', self::HOTEL_DESTINATION_LANG_TABLE, 'language');
        $this->addForeignKey('fk_hotel_destination_lang', self::HOTEL_DESTINATION_LANG_TABLE, 'hotel_destination_id', self::HOTEL_DESTINATION_TABLE, 'id', 'CASCADE', 'CASCADE');

        $this->createTable(self::HOTEL_TABLE, [
            'id' => $this->primaryKey(),
            'slug' => $this->string(255)->notNull(),
            'destination_id' => $this->integer(),
            'status' => $this->integer(1)->notNull()->defaultValue(0)->comment('0-pending,1-published'),
            'comment_status' => $this->integer(1)->notNull()->defaultValue(1)->comment('0-closed,1-open'),
            'thumbnail' => $this->string(255),
            'published_at' => $this->integer(),
            'created_at' => $this->integer(),
            'updated_at' => $this->integer(),
            'created_by' => $this->integer(),
            'updated_by' => $this->integer(),
            'revision' => $this->integer(1)->notNull()->defaultValue(1),
        ], $tableOptions);

        $this->createIndex('hotel_slug', self::HOTEL_TABLE, 'slug');
        $this->createIndex('hotel_destination_id', self::HOTEL_TABLE, 'destination_id');
        $this->createIndex('hotel_status', self::HOTEL_TABLE, 'status');
        $this->addForeignKey('fk_hotel_destination_id', self::HOTEL_TABLE, 'destination_id', self::HOTEL_DESTINATION_TABLE, 'id', 'SET NULL', 'CASCADE');
        $this->addForeignKey('fk_hotel_created_by', self::HOTEL_TABLE, 'created_by', '{{%user}}', 'id', 'SET NULL', 'CASCADE');
        $this->addForeignKey('fk_hotel_updated_by', self::HOTEL_TABLE, 'updated_by', '{{%user}}', 'id', 'SET NULL', 'CASCADE');

        $this->createTable(self::HOTEL_LANG_TABLE, [
            'id' => $this->primaryKey(),
            'hotel_id' => $this->integer()->notNull(),
            'language' => $this->string(6)->notNull(),
            'title' => $this->text(),
            'content' => $this->text(),
        ], $tableOptions);

        $this->createIndex('hotel_lang_hotel_id', self::HOTEL_LANG_TABLE, 'hotel_id');
        $this->createIndex('hotel_lang_language', self::HOTEL_LANG_TABLE, 'language');
        $this->addForeignKey('fk_hotel_lang', self::HOTEL_LANG_TABLE, 'hotel_id', self::HOTEL_TABLE, 'id', 'CASCADE', 'CASCADE');
    }

    public function safeDown()
    {
        $this->dropForeignKey('fk_hotel_destination_id', self::HOTEL_TABLE);
        $this->dropForeignKey('fk_hotel_created_by', self::HOTEL_TABLE);
        $this->dropForeignKey('fk_hotel_updated_by', self::HOTEL_TABLE);
        $this->dropForeignKey('fk_hotel_lang', self::HOTEL_LANG_TABLE);

        $this->dropForeignKey('fk_hotel_destination_lang', self::HOTEL_DESTINATION_LANG_TABLE);
        $this->dropForeignKey('fk_hotel_destination_created_by', self::HOTEL_DESTINATION_TABLE);
        $this->dropForeignKey('fk_hotel_destination_updated_by', self::HOTEL_DESTINATION_TABLE);

        $this->dropTable(self::HOTEL_DESTINATION_LANG_TABLE);
        $this->dropTable(self::HOTEL_DESTINATION_TABLE);

        $this->dropTable(self::HOTEL_LANG_TABLE);
        $this->dropTable(self::HOTEL_TABLE);
    }
}