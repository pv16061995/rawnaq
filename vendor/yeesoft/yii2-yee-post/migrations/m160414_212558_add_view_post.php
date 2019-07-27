<?php

use yii\db\Migration;

class m160414_212558_add_view_post extends Migration
{
    const POST_TABLE = '{{%post}}';
    
    public function safeUp()
    {
        $this->addColumn(self::POST_TABLE, 'view', $this->string(255)->notNull()->defaultValue('post'));
        $this->addColumn(self::POST_TABLE, 'layout', $this->string(255)->notNull()->defaultValue('main'));
    }

    public function safeDown()
    {
        $this->dropColumn(self::POST_TABLE, 'view');
        $this->dropColumn(self::POST_TABLE, 'layout');
    }
}