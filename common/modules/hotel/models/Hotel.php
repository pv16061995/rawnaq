<?php

namespace common\modules\hotel\models;

use yeesoft\behaviors\MultilingualBehavior;
use yeesoft\models\OwnerAccess;
use yeesoft\models\User;
use Yii;
use yii\behaviors\BlameableBehavior;
use yii\behaviors\SluggableBehavior;
use yii\behaviors\TimestampBehavior;
use yeesoft\db\ActiveRecord;
use yii\helpers\Html;

/**
 * This is the model class for table "host".
 *
 * @property integer $id
 * @property string $slug
 * @property string $view
 * @property string $layout
 * @property integer $destination_id
 * @property integer $status
 * @property integer $comment_status
 * @property string $thumbnail
 * @property integer $published_at
 * @property integer $created_at
 * @property integer $updated_at
 * @property integer $created_by
 * @property integer $updated_by
 * @property integer $revision
 *
 * @property HotelDestination $destination
 * @property User $createdBy
 * @property User $updatedBy
 * @property HotelLang[] $hotelLangs
 * @property Services[] $services
 */
class Hotel extends ActiveRecord implements OwnerAccess
{

    const STATUS_PENDING = 0;
    const STATUS_PUBLISHED = 1;
    const COMMENT_STATUS_CLOSED = 0;
    const COMMENT_STATUS_OPEN = 1;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%hotel}}';
    }

    /**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();

        if ($this->isNewRecord && $this->className() == Hotel::className()) {
            $this->published_at = time();
        }

        $this->on(self::EVENT_BEFORE_UPDATE, [$this, 'updateRevision']);
        //$this->on(self::EVENT_AFTER_UPDATE, [$this, 'saveServices']);
        //$this->on(self::EVENT_AFTER_INSERT, [$this, 'saveServices']);
    }

    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            TimestampBehavior::className(),
            BlameableBehavior::className(),
            'sluggable' => [
                'class' => SluggableBehavior::className(),
                'attribute' => 'title',
            ],
            'multilingual' => [
                'class' => MultilingualBehavior::className(),
                'langForeignKey' => 'hotel_id',
                'tableName' => "{{%hotel_lang}}",
                'attributes' => [
                    'title', 'content',
                ]
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['title'], 'required'],
            [['created_by', 'updated_by', 'status', 'comment_status', 'revision', 'destination_id', 'show_on_home', 'distance', 'no_of_rooms'], 'integer'],
            [['title', 'content', 'view', 'layout'], 'string'],
            [['created_at', 'updated_at', 'star_rating'], 'safe'],
            [['slug'], 'string', 'max' => 127],
            [['thumbnail','banner','logo'], 'string', 'max' => 255],
            [['price', 'recommended_for'], 'string', 'max' => 200],
            [['address', 'travel'], 'string', 'max' => 300],
            ['published_at', 'date', 'timestampAttribute' => 'published_at', 'format' => 'yyyy-MM-dd'],
            ['published_at', 'default', 'value' => time()],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => Yii::t('yee', 'ID'),
            'created_by' => Yii::t('yee', 'Author'),
            'updated_by' => Yii::t('yee', 'Updated By'),
            'slug' => Yii::t('yee', 'Slug'),
            'view' => Yii::t('yee', 'View'),
            'layout' => Yii::t('yee', 'Layout'),
            'title' => Yii::t('yee', 'Title'),
            'status' => Yii::t('yee', 'Status'),
            'comment_status' => Yii::t('yee', 'Comment Status'),
            'content' => Yii::t('yee', 'Content'),
            'destination_id' => Yii::t('yee', 'Destination'),
            'thumbnail' => Yii::t('yee/hotel', 'Thumbnail'),
            'banner' => Yii::t('yee/hotel', 'Banner'),
            'logo' => Yii::t('yee/hotel', 'Logo'),
            'address' => Yii::t('yee/hotel', 'Address'),
            'price' => Yii::t('yee/hotel', 'Price'),
            'published_at' => Yii::t('yee', 'Published'),
            'created_at' => Yii::t('yee', 'Created'),
            'updated_at' => Yii::t('yee', 'Updated'),
            'revision' => Yii::t('yee', 'Revision'),
            'serviceValues' => Yii::t('yee', 'Services'),
            'star_rating' => Yii::t('yee', 'Star Rating'),
            'distance' => Yii::t('yee', 'Distance'),
            'travel' => Yii::t('yee', 'Travel'),
            'no_of_rooms' => Yii::t('yee', 'No. of Roms'),
            'recommended_for' => Yii::t('yee', 'Recommended For'),
            'show_on_home' => Yii::t('yee', 'Show on Home Page Carousel'),
        ];
    }

    /**
     * @inheritdoc
     * @return HotelQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new HotelQuery(get_called_class());
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getDestination()
    {
        return $this->hasOne(Destination::className(), ['id' => 'destination_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getServiceValues()
    {
        $ids = [];
        $services = $this->services;
        foreach ($services as $service) {
            $ids[] = $service->id;
        }

        return json_encode($ids);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getServices()
    {
        return $this->hasMany(Service::className(), ['id' => 'service_id'])
                    ->viaTable('{{%hotel_service_hotel}}', ['hotel_id' => 'id']);
    }

    /**
     * Handle save service event of the owner.
     */
    public function saveServices()
    {
        /** @var Hotel $owner */
        $owner = $this->owner;
        $services = Yii::$app->getRequest()->post('HotelServices');

        if (is_array($services)) {
            $owner->unlinkAll('services', true);

            foreach ($services as $service) {
                if (!ctype_digit($service) || !$linkTag = Service::findOne($service)) {
                    $linkTag = new Service(['title' => (string) $service]);
                    $linkTag->setScenario(Service::SCENARIO_AUTOGENERATED);
                    $linkTag->save();
                }

                $owner->link('services', $linkTag);
            }
        }
    }

    public function getAuthor()
    {
        return $this->hasOne(User::className(), ['id' => 'created_by']);
    }

    public function getUpdatedBy()
    {
        return $this->hasOne(User::className(), ['id' => 'updated_by']);
    }

    public function getPublishedDate()
    {
        return Yii::$app->formatter->asDate(($this->isNewRecord) ? time() : $this->published_at);
    }

    public function getCreatedDate()
    {
        return Yii::$app->formatter->asDate(($this->isNewRecord) ? time() : $this->created_at);
    }

    public function getUpdatedDate()
    {
        return Yii::$app->formatter->asDate(($this->isNewRecord) ? time() : $this->updated_at);
    }

    public function getPublishedTime()
    {
        return Yii::$app->formatter->asTime(($this->isNewRecord) ? time() : $this->published_at);
    }

    public function getCreatedTime()
    {
        return Yii::$app->formatter->asTime(($this->isNewRecord) ? time() : $this->created_at);
    }

    public function getUpdatedTime()
    {
        return Yii::$app->formatter->asTime(($this->isNewRecord) ? time() : $this->updated_at);
    }

    public function getPublishedDatetime()
    {
        return "{$this->publishedDate} {$this->publishedTime}";
    }

    public function getCreatedDatetime()
    {
        return "{$this->createdDate} {$this->createdTime}";
    }

    public function getUpdatedDatetime()
    {
        return "{$this->updatedDate} {$this->updatedTime}";
    }

    public function getStatusText()
    {
        return $this->getStatusList()[$this->status];
    }

    public function getCommentStatusText()
    {
        return $this->getCommentStatusList()[$this->comment_status];
    }

    public function getRevision()
    {
        return ($this->isNewRecord) ? 1 : $this->revision;
    }

    public function updateRevision()
    {
        $this->updateCounters(['revision' => 1]);
    }

    public function getShortContent($delimiter = '<!-- pagebreak -->', $allowableTags = '<a>')
    {
        $content = explode($delimiter, $this->content);
        return strip_tags($content[0], $allowableTags);
    }

    public function getThumbnail($options = ['class' => 'thumbnail pull-left', 'style' => 'width: 240px'])
    {
        if (!empty($this->thumbnail)) {
            return Html::img($this->thumbnail, $options);
        }

        return;
    }

    /**
     * getTypeList
     * @return array
     */
    public static function getStatusList()
    {
        return [
            self::STATUS_PENDING => Yii::t('yee', 'Pending'),
            self::STATUS_PUBLISHED => Yii::t('yee', 'Published'),
        ];
    }

    /**
     * getStatusOptionsList
     * @return array
     */
    public static function getStatusOptionsList()
    {
        return [
            [self::STATUS_PENDING, Yii::t('yee', 'Pending'), 'default'],
            [self::STATUS_PUBLISHED, Yii::t('yee', 'Published'), 'primary']
        ];
    }

    /**
     * getCommentStatusList
     * @return array
     */
    public static function getCommentStatusList()
    {
        return [
            self::COMMENT_STATUS_OPEN => Yii::t('yee', 'Open'),
            self::COMMENT_STATUS_CLOSED => Yii::t('yee', 'Closed')
        ];
    }

    /**
     *
     * @inheritdoc
     */
    public static function getFullAccessPermission()
    {
        return 'fullHotelAccess';
    }

    /**
     *
     * @inheritdoc
     */
    public static function getOwnerField()
    {
        return 'created_by';
    }

    public function getHotelServices()
    {
        return $this->hasMany(HotelServices::className(), ['hotel_id' => 'id']);

        return $this->hasMany(Service::className(), ['id' => 'service_id'])
                ->viaTable('{{%hotel_service_hotel}}', ['hotel_id' => 'id']);

        return HotelServices::find()
                ->joinWith('hotel')
            ->Where(['hotel_id'=>$hotelID])
            ->all();
    }
    
    public function getHotelRooms()
    {
        return $this->hasMany(Room::className(), ['id' => 'room_id'])
                ->viaTable('{{%hotel_room_hotel}}', ['hotel_id' => 'id']);
        //return $this->hasMany(HotelRooms::className(), ['hotel_id' => 'id']);
    }
    
    public function getHotelGalleries()
    {
        return $this->hasMany(HotelGalleries::className(), ['hotel_id' => 'id']);
        
    }
}
