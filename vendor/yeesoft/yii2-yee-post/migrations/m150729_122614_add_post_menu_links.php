<?php

use yii\db\Migration;

class m150729_122614_add_post_menu_links extends Migration
{

    public function up()
    {
        $this->insert('{{%menu_link}}', ['id' => 'post', 'menu_id' => 'admin-menu', 'image' => 'pencil', 'created_by' => 1, 'order' => 3]);
        $this->insert('{{%menu_link}}', ['id' => 'post-post', 'menu_id' => 'admin-menu', 'link' => '/post/default/index', 'parent_id' => 'post', 'created_by' => 1, 'order' => 1]);
        $this->insert('{{%menu_link}}', ['id' => 'post-category', 'menu_id' => 'admin-menu', 'link' => '/post/category/index', 'parent_id' => 'post', 'created_by' => 1, 'order' => 2]);

        $this->insert('{{%menu_link_lang}}', ['link_id' => 'post', 'label' => 'Posts', 'language' => 'en-US']);
        $this->insert('{{%menu_link_lang}}', ['link_id' => 'post-post', 'label' => 'Posts', 'language' => 'en-US']);
        $this->insert('{{%menu_link_lang}}', ['link_id' => 'post-category', 'label' => 'Categories', 'language' => 'en-US']);
    }

    public function down()
    {
        $this->delete('{{%menu_link}}', ['like', 'id', 'post-category']);
        $this->delete('{{%menu_link}}', ['like', 'id', 'post-post']);
        $this->delete('{{%menu_link}}', ['like', 'id', 'post']);
    }
}