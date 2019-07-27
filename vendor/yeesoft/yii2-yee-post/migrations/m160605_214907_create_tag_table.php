<?php

use yii\db\Migration;

class m160605_214907_create_tag_table extends Migration
{

    const POST_TABLE = '{{%post}}';
    const TAG_TABLE = '{{%post_tag}}';
    const TAG_LANG_TABLE = '{{%post_tag_lang}}';
    const TAG_POST_TABLE = '{{%post_tag_post}}';

    public function safeUp()
    {
        $tableOptions = null;
        if ($this->db->driverName === 'mysql') {
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_general_ci ENGINE=InnoDB';
        }

        $this->createTable(self::TAG_TABLE, [
            'id' => $this->primaryKey(),
            'slug' => $this->string(200)->notNull(),
            'created_at' => $this->integer(),
            'updated_at' => $this->integer(),
            'created_by' => $this->integer(),
            'updated_by' => $this->integer(),
        ], $tableOptions);

        $this->createIndex('post_tag_slug', self::TAG_TABLE, 'slug');
        $this->addForeignKey('fk_post_tag_created_by', self::TAG_TABLE, 'created_by', '{{%user}}', 'id', 'SET NULL', 'CASCADE');
        $this->addForeignKey('fk_post_tag_updated_by', self::TAG_TABLE, 'updated_by', '{{%user}}', 'id', 'SET NULL', 'CASCADE');

        $this->createTable(self::TAG_LANG_TABLE, [
            'id' => $this->primaryKey(),
            'post_tag_id' => $this->integer(),
            'language' => $this->string(6)->notNull(),
            'title' => $this->string(255)->notNull(),
        ], $tableOptions);

        $this->createIndex('post_tag_lang_id', self::TAG_LANG_TABLE, 'post_tag_id');
        $this->createIndex('post_tag_lang_language', self::TAG_LANG_TABLE, 'language');
        $this->addForeignKey('fk_post_tag_lang', self::TAG_LANG_TABLE, 'post_tag_id', self::TAG_TABLE, 'id', 'CASCADE', 'CASCADE');

        $this->createTable(self::TAG_POST_TABLE, [
            'id' => $this->primaryKey(),
            'post_id' => $this->integer(),
            'tag_id' => $this->integer(),
        ], $tableOptions);
        
        $this->addForeignKey('fk_post_tag_post_id', self::TAG_POST_TABLE, 'post_id', self::POST_TABLE, 'id', 'CASCADE', 'CASCADE');
        $this->addForeignKey('fk_post_tag_tag_id', self::TAG_POST_TABLE, 'tag_id', self::TAG_TABLE, 'id', 'CASCADE', 'CASCADE');

    }

    public function safeDown()
    {
        $this->dropForeignKey('fk_post_tag_lang', self::TAG_LANG_TABLE);
        $this->dropForeignKey('fk_post_tag_created_by', self::TAG_TABLE);
        $this->dropForeignKey('fk_post_tag_updated_by', self::TAG_TABLE);
        $this->dropForeignKey('fk_post_tag_post_id', self::TAG_POST_TABLE);
        $this->dropForeignKey('fk_post_tag_tag_id', self::TAG_POST_TABLE);

        $this->delete(self::TAG_POST_TABLE);
        $this->delete(self::TAG_LANG_TABLE);
        $this->delete(self::TAG_TABLE);
    }

}
