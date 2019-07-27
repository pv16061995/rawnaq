<?php

namespace common\modules\hotel\models\search;

use common\modules\hotel\models\Destination;
use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;

/**
 * DestinationSearch represents the model behind the search form about `common\modules\hotel\models\Destination`.
 */
class DestinationSearch extends Destination
{
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'visible', 'created_by', 'updated_by', 'parent_id'], 'integer'],
            [['slug', 'title', 'description', 'created_at', 'updated_at'], 'safe'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    /**
     * Creates data provider instance with search query applied
     *
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params)
    {
        $query = Destination::find()->joinWith('translations');

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'pagination' => [
                'pageSize' => Yii::$app->request->cookies->getValue('_grid_page_size', 20),
            ],
            'sort' => [
                'defaultOrder' => [
                    'id' => SORT_DESC,
                ],
            ],
        ]);

        $this->load($params);

        if (!$this->validate()) {
            return $dataProvider;
        }

        $query->andFilterWhere([
            'id' => $this->id,
            'visible' => $this->visible,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ]);

        if (isset($this->parent_id) && $this->parent_id > 1) {
            $parent = Destination::findOne((int)$this->parent_id);
            $query->andWhere(['>', 'left_border', $parent->left_border]);
            $query->andWhere(['<', 'right_border', $parent->right_border]);
        }

        $query->andFilterWhere(['like', 'slug', $this->slug])
            ->andFilterWhere(['like', 'title', $this->title])
            ->andFilterWhere(['like', 'description', $this->description]);

        return $dataProvider;
    }
}