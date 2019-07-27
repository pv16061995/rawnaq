<?php

use yeesoft\db\SourceMessagesMigration;

class m151121_235015_i18n_yee_settings_source extends SourceMessagesMigration
{

    public function getCategory()
    {
        return 'yee/settings';
    }

    public function getMessages()
    {
        return [
            'General Settings' => 1,
            'Reading Settings' => 1,
            'Site Title' => 1,
            'Site Description' => 1,
            'Admin Email' => 1,
            'Timezone' => 1,
            'Date Format' => 1,
            'Time Format' => 1,
            'Page Size' => 1,
        ];
    }
}