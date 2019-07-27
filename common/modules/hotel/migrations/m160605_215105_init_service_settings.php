<?php

use yii\db\Migration;

class m160605_215105_init_service_settings extends Migration
{

    const HOTEL_TABLE = '{{%hotel}}';
    const SERVICE_TABLE = '{{%hotel_service}}';
    const SERVICE_LANG_TABLE = '{{%hotel_service_lang}}';
    const SERVICE_HOTEL_TABLE = '{{%hotel_service_hotel}}';

    public function safeUp()
    {
        //$this->insert('{{%menu_link}}', ['id' => 'hotel_service', 'menu_id' => 'admin-menu', 'link' => '/hotel/service/index', 'parent_id' => 'hotel', 'created_by' => 1, 'order' => 2]);
        //$this->insert('{{%menu_link_lang}}', ['link_id' => 'hotel-service', 'label' => 'Services', 'language' => 'en-US']);
    }

    public function safeDown()
    {
        //$this->delete('{{%menu_link}}', ['like', 'id', 'hotel-Destination']);
    }

}
