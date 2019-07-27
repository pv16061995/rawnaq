<?php

use yii\db\Migration;

class m160605_214907_create_room_table extends Migration
{

    const HOTEL_TABLE = '{{%hotel}}';
    const ROOM_TABLE = '{{%hotel_room}}';
    const ROOM_LANG_TABLE = '{{%hotel_room_lang}}';
    const ROOM_HOTEL_TABLE = '{{%hotel_room_hotel}}';

    public function safeUp()
    {
        $tableOptions = null;
        if ($this->db->driverName === 'mysql') {
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_general_ci ENGINE=InnoDB';
        }

        $this->createTable(self::ROOM_TABLE, [
            'id' => $this->primaryKey(),
            'created_at' => $this->integer(),
            'updated_at' => $this->integer(),
            'created_by' => $this->integer(),
            'updated_by' => $this->integer(),
        ], $tableOptions);

        $this->addForeignKey('fk_hotel_room_created_by', self::ROOM_TABLE, 'created_by', '{{%user}}', 'id', 'SET NULL', 'CASCADE');
        $this->addForeignKey('fk_hotel_room_updated_by', self::ROOM_TABLE, 'updated_by', '{{%user}}', 'id', 'SET NULL', 'CASCADE');

        $this->createTable(self::ROOM_LANG_TABLE, [
            'id' => $this->primaryKey(),
            'hotel_room_id' => $this->integer(),
            'language' => $this->string(6)->notNull(),
            'title' => $this->string(255)->notNull(),
        ], $tableOptions);

        $this->createIndex('hotel_room_lang_id', self::ROOM_LANG_TABLE, 'hotel_room_id');
        $this->createIndex('hotel_room_lang_language', self::ROOM_LANG_TABLE, 'language');
        $this->addForeignKey('fk_hotel_room_lang', self::ROOM_LANG_TABLE, 'hotel_room_id', self::ROOM_TABLE, 'id', 'CASCADE', 'CASCADE');

        $this->createTable(self::ROOM_HOTEL_TABLE, [
            'id' => $this->primaryKey(),
            'hotel_id' => $this->integer(),
            'room_id' => $this->integer(),
        ], $tableOptions);
        
        $this->addForeignKey('fk_hotel_room_hotel_id', self::ROOM_HOTEL_TABLE, 'hotel_id', self::HOTEL_TABLE, 'id', 'CASCADE', 'CASCADE');
        $this->addForeignKey('fk_hotel_room_room_id', self::ROOM_HOTEL_TABLE, 'room_id', self::ROOM_TABLE, 'id', 'CASCADE', 'CASCADE');

    }

    public function safeDown()
    {
        $this->dropForeignKey('fk_hotel_room_lang', self::ROOM_LANG_TABLE);
        $this->dropForeignKey('fk_hotel_room_created_by', self::ROOM_TABLE);
        $this->dropForeignKey('fk_hotel_room_updated_by', self::ROOM_TABLE);
        $this->dropForeignKey('fk_hotel_room_hotel_id', self::ROOM_HOTEL_TABLE);
        $this->dropForeignKey('fk_hotel_room_hotel_id', self::ROOM_HOTEL_TABLE);

        $this->delete(self::ROOM_HOTEL_TABLE);
        $this->delete(self::ROOM_LANG_TABLEE);
        $this->delete(self::ROOM_TABLE);
    }

}
