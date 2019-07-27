<?php

namespace yeesoft\post\models;

use paulzi\nestedintervals\NestedIntervalsBehavior;
use yeesoft\behaviors\MultilingualBehavior;
use yeesoft\models\OwnerAccess;
use Yii;
use yii\behaviors\BlameableBehavior;
use yii\behaviors\SluggableBehavior;
use yii\behaviors\TimestampBehavior;
use yeesoft\db\ActiveRecord;

/**
 * This is the model class for table "post_category".
 *
 * @property integer $id
 * @property string $slug
 * @property string $title
 * @property integer $visible
 * @property string $description
 * @property integer $created_at
 * @property integer $updated_at
 * @property integer $created_by
 * @property integer $updated_by
 */
class Category extends ActiveRecord implements OwnerAccess
{

    public $parent_id;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%post_category}}';
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
            [['created_by', 'updated_by', 'created_at', 'updated_at', 'visible', 'parent_id'], 'integer'],
            [['description'], 'string'],
            [['slug', 'title'], 'string', 'max' => 255],
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
                'langForeignKey' => 'post_category_id',
                'tableName' => "{{%post_category_lang}}",
                'attributes' => [
                    'title', 'description',
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
            'title' => Yii::t('yee', 'Title'),
            'visible' => Yii::t('yee', 'Visible'),
            'description' => Yii::t('yee', 'Description'),
            'created_by' => Yii::t('yee', 'Created By'),
            'updated_by' => Yii::t('yee', 'Updated By'),
            'created_at' => Yii::t('yee', 'Created'),
            'updated_at' => Yii::t('yee', 'Updated'),
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
            $parent = Category::findOne((int)$this->parent_id);
        }

        if (!$parent) {
            $parent = Category::findOne(1);
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
    public function getPosts()
    {
        return $this->hasMany(Post::className(), ['category_id' => 'id']);
    }

    /**
     * Return all categories.
     *
     * @param bool $asArray
     *
     * @return static[]
     */
    public static function getCategories($skipCategories = [])
    {
        $result = [];
        $categories = Category::findOne(1)->getDescendants()->joinWith('translations')->all();

        foreach ($categories as $category) {
            if (!in_array($category->id, $skipCategories)) {
                $result[$category->id] = str_repeat('   ', ($category->depth - 1)) . $category->title;
            }
        }

        return $result;
    }


    public static function find()
    {
        return new CategoryQuery(get_called_class());

    }

    /**
     *
     * @inheritdoc
     */
    public static function getFullAccessPermission()
    {
        return 'fullPostCategoryAccess';
    }

    /**
     *
     * @inheritdoc
     */
    public static function getOwnerField()
    {
        return 'created_by';
    }
}