<?php

use yii\db\Migration;

class m160414_212558_add_view_hotel extends Migration
{
    const HOTEL_TABLE = '{{%hotel}}';
    
    public function safeUp()
    {
        $this->addColumn(self::HOTEL_TABLE, 'view', $this->string(255)->notNull()->defaultValue('hotel'));
        $this->addColumn(self::HOTEL_TABLE, 'layout', $this->string(255)->notNull()->defaultValue('main'));
    }

    public function safeDown()
    {
        $this->dropColumn(self::HOTEL_TABLE, 'view');
        $this->dropColumn(self::HOTEL_TABLE, 'layout');
    }
}