<?php

namespace yeesoft\comment\models\search;

use yeesoft\comments\models\Comment;
use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;

/**
 * CommentSearch represents the model behind the search form about `yeesoft\comments\models\Comment`.
 */
class CommentSearch extends Comment
{
    public $created_at_operand;

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'model_id', 'user_id', 'parent_id', 'status', 'updated_at'], 'integer'],
            [['model', 'username', 'email', 'content', 'user_ip', 'created_at', 'created_at_operand'], 'safe'],
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
        $query = Comment::find();

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
            // uncomment the following line if you do not want to return any records when validation fails
            // $query->where('0=1');
            return $dataProvider;
        }

        $query->andFilterWhere(['status' => ($this->status !== NULL) ? $this->status : 1]);

        $query->andFilterWhere([
            'id' => $this->id,
            'model_id' => $this->model_id,
            'user_id' => $this->user_id,
            'parent_id' => $this->parent_id,
            //'status' => $this->status,
            'updated_at' => $this->updated_at,
        ]);

        switch ($this->created_at_operand) {
            case '=':
                $query->andFilterWhere(['>=', 'created_at', strtotime($this->created_at)]);
                $query->andFilterWhere(['<=', 'created_at', strtotime($this->created_at . ' 23:59:59')]);
                break;
            case '>':
                $query->andFilterWhere(['>', 'created_at', strtotime($this->created_at . ' 23:59:59')]);
                break;
            case '<':
                $query->andFilterWhere(['<', 'created_at', strtotime($this->created_at)]);
                break;
            default:
                break;
        }

        $query->andFilterWhere(['like', 'model', $this->model])
            ->andFilterWhere(['like', 'username', $this->username])
            ->andFilterWhere(['like', 'email', $this->email])
            ->andFilterWhere(['like', 'content', $this->content])
            ->andFilterWhere(['like', 'user_ip', $this->user_ip]);

        return $dataProvider;
    }
}