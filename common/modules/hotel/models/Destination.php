<?php

namespace common\modules\hotel\models;

use paulzi\nestedintervals\NestedIntervalsBehavior;
use yeesoft\behaviors\MultilingualBehavior;
use yeesoft\models\OwnerAccess;
use Yii;
use yii\behaviors\BlameableBehavior;
use yii\behaviors\SluggableBehavior;
use yii\behaviors\TimestampBehavior;
use yeesoft\db\ActiveRecord;

/**
 * This is the model class for table "hotel_destination".
 *
 * @property integer $id
 * @property string $slug
 * @property string $thumbnail
 * @property string $title
 * @property integer $visible
 * @property string $description
 * @property integer $created_at
 * @property integer $updated_at
 * @property integer $created_by
 * @property integer $updated_by
 */
class Destination extends ActiveRecord implements OwnerAccess
{

    public $parent_id;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%hotel_destination}}';
    }

    /**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();
        $this->visible = 1;
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['title'], 'required'],
            [['created_by', 'updated_by', 'created_at', 'updated_at', 'visible', 'parent_id', 'show_on_home'], 'integer'],
            [['description', 'thumbnail', 'sub_description'], 'string'],
            [['slug', 'title', 'thumbnail'], 'string', 'max' => 255],
            [['banner'], 'safe'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            BlameableBehavior::className(),
            TimestampBehavior::className(),
            'sluggable' => [
                'class' => SluggableBehavior::className(),
                'attribute' => 'title',
            ],
            'multilingual' => [
                'class' => MultilingualBehavior::className(),
                'langForeignKey' => 'hotel_destination_id',
                'tableName' => "{{%hotel_destination_lang}}",
                'attributes' => [
                    'title', 'description', 'sub_description',
                ]
            ],
            'nestedInterval' => [
                'class' => NestedIntervalsBehavior::className(),
                'leftAttribute' => 'left_border',
                'rightAttribute' => 'right_border',
                'amountOptimize' => '25',
                'noPrepend' => true,
            ],
        ];
    }

    public function transactions()
    {
        return [
            self::SCENARIO_DEFAULT => self::OP_ALL,
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('yee', 'ID'),
            'slug' => Yii::t('yee', 'Slug'),
            'thumbnail' => Yii::t('yee', 'Thumbnail'),
            'title' => Yii::t('yee', 'Destination Name'),
            'visible' => Yii::t('yee', 'Visible'),
            'description' => Yii::t('yee', 'Description'),
            'sub_description' => Yii::t('yee', 'Sub Description'),
            'created_by' => Yii::t('yee', 'Created By'),
            'updated_by' => Yii::t('yee', 'Updated By'),
            'created_at' => Yii::t('yee', 'Created'),
            'updated_at' => Yii::t('yee', 'Updated'),
            'banner' => Yii::t('yee', 'Banner'),
            'show_on_home' => Yii::t('yee', 'Show on Home Page'),
        ];
    }

    /**
     *
     * @inheritdoc
     */
    public function save($runValidation = true, $attributeNames = null)
    {
        $parent = null;

        if (isset($this->parent_id) && $this->parent_id) {
            $parent = Destination::findOne((int)$this->parent_id);
        }

        if (!$parent) {
            $parent = Destination::findOne(1);
        }

        if (!$parent) {
            throw new \yii\base\InvalidParamException();
        }


        $this->appendTo($parent);

        try {
            return parent::save($runValidation, $attributeNames);
        } catch (yii\base\Exception $exc) {
            \Yii::$app->session->setFlash('crudMessage', $exc->getMessage());
        }

    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getHotels()
    {
        return $this->hasMany(Hotel::className(), ['destination_id' => 'id']);
    }

    /**
     * Return all destinations.
     *
     * @param bool $asArray
     *
     * @return static[]
     */
    public static function getDestinations($skipDestinations = [])
    {
        $result = [];
        $destinations = Destination::findOne(1)->getDescendants()->joinWith('translations')->all();

        foreach ($destinations as $destination) {
            if (!in_array($destination->id, $skipDestinations)) {
                $result[$destination->id] = str_repeat('   ', ($destination->depth - 1)) . $destination->title;
            }
        }

        return $result;
    }


    public static function find()
    {
        return new DestinationQuery(get_called_class());

    }

    /**
     *
     * @inheritdoc
     */
    public static function getFullAccessPermission()
    {
        return 'fullHotelDestinationAccess';
    }

    /**
     *
     * @inheritdoc
     */
    public static function getOwnerField()
    {
        return 'created_by';
    }
    
    public function getDestinationGalleries()
    {
        return $this->hasMany(DestinationGalleries::className(), ['hotel_destination_id' => 'id']);
        
    }
}