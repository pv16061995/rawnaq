<?php

use yii\db\Migration;

class m160605_214907_create_service_table extends Migration
{

    const HOTEL_TABLE = '{{%hotel}}';
    const SERVICE_TABLE = '{{%hotel_service}}';
    const SERVICE_LANG_TABLE = '{{%hotel_service_lang}}';
    const SERVICE_HOTEL_TABLE = '{{%hotel_service_hotel}}';

    public function safeUp()
    {
        $tableOptions = null;
        if ($this->db->driverName === 'mysql') {
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_general_ci ENGINE=InnoDB';
        }

        $this->createTable(self::SERVICE_TABLE, [
            'id' => $this->primaryKey(),
            'slug' => $this->string(200)->notNull(),
            'service_type'=>$this->string(200)->notNull(),
            'created_at' => $this->integer(),
            'updated_at' => $this->integer(),
            'created_by' => $this->integer(),
            'updated_by' => $this->integer(),
        ], $tableOptions);

        $this->createIndex('hotel_service_slug', self::SERVICE_TABLE, 'slug');
        $this->addForeignKey('fk_hotel_service_created_by', self::SERVICE_TABLE, 'created_by', '{{%user}}', 'id', 'SET NULL', 'CASCADE');
        $this->addForeignKey('fk_hotel_service_updated_by', self::SERVICE_TABLE, 'updated_by', '{{%user}}', 'id', 'SET NULL', 'CASCADE');

        $this->createTable(self::SERVICE_LANG_TABLE, [
            'id' => $this->primaryKey(),
            'hotel_service_id' => $this->integer(),
            'language' => $this->string(6)->notNull(),
            'title' => $this->string(255)->notNull(),
        ], $tableOptions);

        $this->createIndex('hotel_service_lang_id', self::SERVICE_LANG_TABLE, 'hotel_service_id');
        $this->createIndex('hotel_service_lang_language', self::SERVICE_LANG_TABLE, 'language');
        $this->addForeignKey('fk_hotel_service_lang', self::SERVICE_LANG_TABLE, 'hotel_service_id', self::SERVICE_TABLE, 'id', 'CASCADE', 'CASCADE');

        $this->createTable(self::SERVICE_HOTEL_TABLE, [
            'id' => $this->primaryKey(),
            'hotel_id' => $this->integer(),
            'service_id' => $this->integer(),
            'service_description' => $this->text(),
        ], $tableOptions);
        
        $this->addForeignKey('fk_hotel_service_hotel_id', self::SERVICE_HOTEL_TABLE, 'hotel_id', self::HOTEL_TABLE, 'id', 'CASCADE', 'CASCADE');
        $this->addForeignKey('fk_hotel_service_service_id', self::SERVICE_HOTEL_TABLE, 'service_id', self::SERVICE_TABLE, 'id', 'CASCADE', 'CASCADE');

    }

    public function safeDown()
    {
        $this->dropForeignKey('fk_hotel_service_lang', self::SERVICE_LANG_TABLE);
        $this->dropForeignKey('fk_hotel_service_created_by', self::SERVICE_TABLE);
        $this->dropForeignKey('fk_hotel_service_updated_by', self::SERVICE_TABLE);
        $this->dropForeignKey('fk_hotel_service_hotel_id', self::SERVICE_HOTEL_TABLE);
        $this->dropForeignKey('fk_hotel_service_hotel_id', self::SERVICE_HOTEL_TABLE);

        $this->delete(self::SERVICE_HOTEL_TABLE);
        $this->delete(self::SERVICE_LANG_TABLE);
        $this->delete(self::SERVICE_TABLE);
    }

}
