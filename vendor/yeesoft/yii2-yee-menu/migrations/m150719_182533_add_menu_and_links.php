<?php

use yii\db\Migration;

class m150719_182533_add_menu_and_links extends Migration
{

    public function up()
    {
        $this->insert('{{%menu_link}}', ['id' => 'menu', 'menu_id' => 'admin-menu', 'link' => '/menu/default/index', 'image' => 'align-justify', 'created_by' => 1, 'order' => 10]);
        $this->insert('{{%menu_link_lang}}', ['link_id' => 'menu', 'label' => 'Menus', 'language' => 'en-US']);
    }

    public function down()
    {
        $this->delete('{{%menu_link}}', ['like', 'id', 'menu']);
    }
}