<?php

namespace common\modules\hotel\models;

use Yii;
use yeesoft\db\ActiveRecord;
use yii\helpers\ArrayHelper;

class DestinationGalleries extends ActiveRecord
{

    /**
     * @return string the name of the table associated with this ActiveRecord class.
     */
    public static function tableName()
    {
        return '{{%hotel_destination_gallery}}';
    }

    public function getDestination(){
        return $this->hasOne(Destination::className(), ['id' => 'hotel_destination_id']);
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['hotel_destination_id'], 'required'],
            [['description','img'], 'string'],
            [['sort_order'], 'number'],
            [['img'], 'safe']
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('yee', 'ID'),
            'hotel_destination_id' => Yii::t('yee', 'Destination'),
            'img' => Yii::t('yee', 'Image'),
            'description' => Yii::t('yee', 'Image Description'),
            'sort_order' => Yii::t('yee', 'Sort')
        ];
    }
    
    /**
     * Creates and populates a set of models.
     *
     * @param string $modelClass
     * @param array $multipleModels
     * @return array
     */
    public static function createMultiple($modelClass, $multipleModels = [])
    {
        $model    = new $modelClass;
        $formName = $model->formName();
        $post     = Yii::$app->request->post($formName);
        $models   = [];

        if (! empty($multipleModels)) {
            $keys = array_keys(ArrayHelper::map($multipleModels, 'id', 'id'));
            $multipleModels = array_combine($keys, $multipleModels);
        }

        if ($post && is_array($post)) {
            foreach ($post as $i => $item) {
                if (isset($item['id']) && !empty($item['id']) && isset($multipleModels[$item['id']])) {
                    $models[] = $multipleModels[$item['id']];
                } else {
                    $models[] = new $modelClass;
                }
            }
        }

        unset($model, $formName, $post);

        return $models;
    }
}
