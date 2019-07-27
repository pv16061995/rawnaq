<?php

namespace common\modules\hotel\models;

use Yii;
use yeesoft\db\ActiveRecord;
use yii\helpers\ArrayHelper;

class HotelRooms extends ActiveRecord
{

    /**
     * @return string the name of the table associated with this ActiveRecord class.
     */
    public static function tableName()
    {
        return '{{%hotel_room_hotel}}';
    }

    public function getHotel(){
        return $this->hasOne(Hotel::className(), ['id' => 'hotel_id']);
    }
    
    public function getRoom(){
        return $this->hasOne(Room::className(), ['id' => 'room_id']);
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['room_id', 'hotel_id'], 'required']
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('yee', 'ID'),
            'hotel_id' => Yii::t('yee', 'Hotel'),
            'room_id' => Yii::t('yee', 'Room'),
        ];
    }

    public function getRooms()
    {
        return $this->hasMany(Room::className(), ['id' => 'room_id']);
    }
}
