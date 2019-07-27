<?php

use yii\db\Migration;

class m160605_214907_create_room_service_table extends Migration
{
    const SERVICE_TABLE = '{{%hotel_service}}';
    const ROOM_TABLE = '{{%hotel_room}}';
    const SERVICE_ROOM_HOTEL_TABLE = '{{%hotel_room_service_hotel}}';

    public function safeUp()
    {
        $tableOptions = null;
        if ($this->db->driverName === 'mysql') {
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_general_ci ENGINE=InnoDB';
        }

        $this->createTable(self::SERVICE_ROOM_HOTEL_TABLE, [
            'id' => $this->primaryKey(),
            'room_id' => $this->integer(),
            'service_id' => $this->integer(),
            'service_description' => $this->text(),
        ], $tableOptions);
        
        $this->addForeignKey('fk_hotel_room_service_id', self::SERVICE_ROOM_HOTEL_TABLE, 'room_id', self::ROOM_TABLE, 'id', 'CASCADE', 'CASCADE');
        $this->addForeignKey('fk_hotel_room_service_room_id', self::SERVICE_ROOM_HOTEL_TABLE, 'service_id', self::SERVICE_TABLE, 'id', 'CASCADE', 'CASCADE');

    }

    public function safeDown()
    {
        $this->dropForeignKey('fk_hotel_room_service_hotel_id', self::SERVICE_ROOM_HOTEL_TABLE);
        $this->dropForeignKey('fk_hotel_room_service_hotel_id', self::SERVICE_ROOM_HOTEL_TABLE);

        $this->delete(self::SERVICE_ROOM_HOTEL_TABLE);
    }

}
