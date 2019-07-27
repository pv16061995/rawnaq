<?php

use yeesoft\db\SourceMessagesMigration;

class m151121_233715_i18n_yee_hotel_source extends SourceMessagesMigration
{

    public function getCategory()
    {
        return 'yee/hotel';
    }

    public function getMessages()
    {
        return [
            'Create Service' => 1,
            'Update Service' => 1,
            'No hotels found.' => 1,
            'Hotel' => 1,
            'Posted in' => 1,
            'Hotels Activity' => 1,
            'Hotels' => 1,
            'Service' => 1,
            'Services' => 1,
            'Thumbnail' => 1,
            'Room' => 1,
            'Rooms' => 1
        ];
    }
}