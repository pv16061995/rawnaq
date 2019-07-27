<?php

namespace common\modules\settings\models;

use Yii;
use yii\helpers\ArrayHelper;

/**
  * @author Muhammad Zakir Mughal <zakirmughal89@gmail.com>
 */
class ReadingSettings extends BaseSettingsModel
{
    const GROUP = 'reading';

    public $page_size;

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return ArrayHelper::merge(parent::rules(),
            [
                [['page_size'], 'required'],
                [['page_size'], 'integer'],
                ['page_size', 'default', 'value' => 10],
            ]);
    }

    public function attributeLabels()
    {
        return [
            'page_size' => Yii::t('yee/settings', 'Page Size'),
        ];
    }

}