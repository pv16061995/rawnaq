<?php

use yii\db\Migration;

class m160605_215105_init_tag_settings extends Migration
{

    const POST_TABLE = '{{%post}}'; 
    const TAG_TABLE = '{{%post_tag}}';
    const TAG_LANG_TABLE = '{{%post_tag_lang}}';
    const TAG_POST_TABLE = '{{%post_tag_post}}';

    public function safeUp()
    {
        $this->insert('{{%menu_link}}', ['id' => 'post-tag', 'menu_id' => 'admin-menu', 'link' => '/post/tag/index', 'parent_id' => 'post', 'created_by' => 1, 'order' => 2]);
        $this->insert('{{%menu_link_lang}}', ['link_id' => 'post-tag', 'label' => 'Tags', 'language' => 'en-US']);
    }

    public function safeDown()
    {
        $this->delete('{{%menu_link}}', ['like', 'id', 'post-category']);
    }

}
