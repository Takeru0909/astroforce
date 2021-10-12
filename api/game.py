import random
import math
from datetime import datetime

random.seed(datetime.now())

# ゲーム状態
class State:
    # 初期化
    def __init__(self, pieces=None):
        # 石の配置
        self.pieces = pieces if pieces != None else [0] * 42

    # 石の数の取得
    def piece_count(self, pieces):
        count = 0
        for i in pieces:
            if 0 < i:
                count += 1
        return count

    # 4並びかどうか
    def is_comp(self, n, x, y, dx, dy):

        # 石が1の場合
        if self.pieces[x+y*7] == 1:
            x_color = x
            y_color = y
            is_pieces_completed = True
            for _ in range(n):
                if x_color < 0 or 6 < x_color or y_color < 0 or 5 < y_color or self.pieces[x_color+y_color*7] in (0, 3, 4):
                    is_pieces_completed = False
                    break
                x_color, y_color = x_color+dx, y_color+dy
            if is_pieces_completed:
                return True
        
        if self.pieces[x+y*7] == 1:
            x_shape = x
            y_shape = y
            is_pieces_completed = True
            for _ in range(n):
                if x_shape < 0 or 6 < x_shape or y_shape < 0 or 5 < y_shape or self.pieces[x_shape+y_shape*7] in (0, 2, 4):
                    is_pieces_completed = False
                    break
                x_shape, y_shape = x_shape+dx, y_shape+dy
            return is_pieces_completed
        
        # 石が2の場合
        if self.pieces[x+y*7] == 2:
            x_color = x
            y_color = y
            is_pieces_completed = True
            for _ in range(n):
                if x_color < 0 or 6 < x_color or y_color < 0 or 5 < y_color or self.pieces[x_color+y_color*7] in (0, 3, 4):
                    is_pieces_completed = False
                    break
                x_color, y_color = x_color+dx, y_color+dy
            if is_pieces_completed:
                return True
        
        if self.pieces[x+y*7] == 2:
            x_shape = x
            y_shape = y
            is_pieces_completed = True
            for _ in range(n):
                if x_shape < 0 or 6 < x_shape or y_shape < 0 or 5 < y_shape or self.pieces[x_shape+y_shape*7] in (0, 1, 3):
                    is_pieces_completed = False
                    break
                x_shape, y_shape = x_shape+dx, y_shape+dy
            return is_pieces_completed
        
        # 石が3の場合
        if self.pieces[x+y*7] == 3:
            x_color = x
            y_color = y
            is_pieces_completed = True
            for _ in range(n):
                if x_color < 0 or 6 < x_color or y_color < 0 or 5 < y_color or self.pieces[x_color+y_color*7] in (0, 2, 4):
                    is_pieces_completed = False
                    break
                x_color, y_color = x_color+dx, y_color+dy
            if is_pieces_completed:
                return True
        
        if self.pieces[x+y*7] == 3:
            x_shape = x
            y_shape = y
            is_pieces_completed = True
            for _ in range(n):
                if x_shape < 0 or 6 < x_shape or y_shape < 0 or 5 < y_shape or self.pieces[x_shape+y_shape*7] in (0, 1, 2):
                    is_pieces_completed = False
                    break
                x_shape, y_shape = x_shape+dx, y_shape+dy
            return is_pieces_completed
        
        # 石が4の場合
        if self.pieces[x+y*7] == 4:
            x_color = x
            y_color = y
            is_pieces_completed = True
            for _ in range(n):
                if x_color < 0 or 6 < x_color or y_color < 0 or 5 < y_color or self.pieces[x_color+y_color*7] in (0, 1, 3):
                    is_pieces_completed = False
                    break
                x_color, y_color = x_color+dx, y_color+dy
            if is_pieces_completed:
                return True
        
        if self.pieces[x+y*7] == 4:
            x_shape = x
            y_shape = y
            is_pieces_completed = True
            for _ in range(n):
                if x_shape < 0 or 6 < x_shape or y_shape < 0 or 5 < y_shape or self.pieces[x_shape+y_shape*7] in (0, 1, 2):
                    is_pieces_completed = False
                    break
                x_shape, y_shape = x_shape+dx, y_shape+dy
            return is_pieces_completed
                                       
    # 負けかどうか
    def is_lose(self, state, n):
        for j in range(6):
            for i in range(7):
                if state.is_comp(n, i, j, 1, 0) or state.is_comp(n, i, j, 0, 1) or \
                    state.is_comp(n, i, j, 1, -1) or state.is_comp(n, i, j, 1, 1):
                    return True
        return False
    # 揃った最初の石の場所の揃い方の種類
    def comp_place(self, state):
        for j in range(6):
            for i in range(7):
                if state.is_comp(4, i, j, 1, 0):
                    return {"i": i, "j": j, "comp_type": "horizontal"}
                elif state.is_comp(4, i, j, 0, 1):
                    return {"i": i, "j": j, "comp_type": "vertical"}
                elif state.is_comp(4, i, j, 1, -1):
                    return {"i": i, "j": j, "comp_type": "diagonal right up"}
                elif state.is_comp(4, i, j, 1, 1):
                    return {"i": i, "j": j, "comp_type": "diagonal right down"}
    
    # 引き分けかどうか
    def is_draw(self):
        return self.piece_count(self.pieces) == 42

    # ゲーム終了かどうか
    def is_done(self, state):
        return self.is_lose(state, 4) or self.is_draw()

    # 次の状態の取得
    def next(self, action, piece_type):
        pieces = self.pieces.copy()
        for j in range(5,-1,-1):
            if self.pieces[action+j*7] == 0:
                pieces[action+j*7] = piece_type
                break
        return State(pieces)

    # 合法手のリストの取得
    def legal_actions(self):
        actions = []
        for i in range(7):
            if self.pieces[i] == 0:
                actions.append(i)
        return actions

    # 先手かどうか
    def is_first_player(self):
        if self.piece_count(self.pieces) % 2 == 0:
            return True
        else:
            return False

    # 文字列表示
    def __str__(self):
        action_type = ["| ○ |", "| ● |", "| □ |", "| ■ |"]
        str = ''
        for i in range(42):
            if self.pieces[i] == 1:
                str += action_type[0]
            elif self.pieces[i] == 2:
                str += action_type[1]
            elif self.pieces[i] == 3:
                str += action_type[2]
            elif self.pieces[i] == 4:
                str += action_type[3]
            else:
                str += '| - |'
            if i % 7 == 6:
                str += '\n'
        return str  

# ランダムで行動選択
def random_action(state):
    legal_actions = state.legal_actions()
    random_action = random.choice(legal_actions)
    legal_piece_type = [2, 4]
    ai_piece_type = random.choice(legal_piece_type)
    return {"ai_random_action": random_action, "ai_piece_type": ai_piece_type}

# アルファベータ法で状態価値計算
def alpha_beta(state, player_name, alpha, beta, turn_num, max_turn_num):
    debug = False
    indent_str = "".join(["####" for i in range (turn_num+1)])
    # ターンが経過するほどスコアの絶対値が小さくなる。より短い手数で決着がつけられるアクションの方が評価値が高くなる設計
    score_decay = 0.95**turn_num

    # Playerの負けは状態価値-1
    # AIの負けは、Playerの勝ちなので、状態価値 +1
    if state.is_lose(state, 4):
        if player_name == "PLAYER":
            return - 1 * score_decay
        else:
            return 1 * score_decay
    
    # 引き分け(石がすべて置かれたが勝敗が決まっていない状態)は状態価値0
    if state.is_draw():
        return 0

    # 深さ制限に達した時
    if turn_num >= max_turn_num:
        # これ以上探索出来ないので、現在の盤面状況から評価値を返す
        if state.is_lose(state, 3):
            if player_name == "PLAYER":
                # AIは次の番にPlayerに負かされる
                return 0.9 * score_decay
            else:
                # Playerは次の番にAIに負かされる
                return - 0.9 * score_decay

        # どちらのプレイヤーが有利か判断出来ない場合は、評価値はランダム
        return random.uniform(-0.2, 0.2) * score_decay

    # 合法手の状態価値の計算    
    if player_name == "PLAYER":
        piece_types= [1, 3]
    else:
        piece_types = [2, 4]
    
    next_player_name = "AI" if player_name == "PLAYER" else "PLAYER"
    next_turn_num = turn_num + 1
    scores = []
    for piece_type in piece_types:
        for action in state.legal_actions():
            # player_nameのプレイヤーが石を置く
            next_state = state.next(action, piece_type)
            if debug:
                print(indent_str, "--------------------------------")
                print(indent_str, "put stone ", "action:", action, " piece_type:", piece_type)
                print(indent_str, "alpha: ", alpha, "beta: ", beta)
                print(next_state)
            score = alpha_beta(next_state, next_player_name, alpha, beta, next_turn_num, max_turn_num)
            
            if player_name == "PLAYER":
                # α ：それまでに発見した自番で最も大きな評価値
                if score > alpha:
                    alpha = score
                # 自分(Player)の手番：β よりも大きい評価値になれば探索打ち切り
                if beta < score:
                    return score
            else: # player_name == "AI"
                # β ：それまでに発見した相手番で最も小さい評価値
                if score < beta:
                    beta = score
                # 相手(AI)の手番：α よりも小さい評価値になれば探索打ち切り
                if alpha > score:
                    return score
            scores.append(score)
            if debug:
                print(indent_str, "updated alpha, beta: ", "alpha: ", alpha, "beta: ", beta)
                print(indent_str, "--------------------------------")

    # 途中で探索が打ち切られなかった場合
    if player_name == "PLAYER":
        return max(scores)
    else:
        return min(scores)

# アルファベータ法で行動選択
# α ：それまでに発見した自番で最も大きな評価値
# β ：それまでに発見した相手番で最も小さい評価値
# 相手(AI)の手番：α よりも小さい評価値になれば探索打ち切り
# 自分(Player)の手番：β よりも大きい評価値になれば探索打ち切り
# α 以上β 以下の手を探索する
# 参考: https://www.info.kindai.ac.jp/~takasi-i/lecture/Study09note.pdf
def alpha_beta_action(state, max_turn_num):
    debug = False
    # AIの番: 最も低い評価値を探す
    # 合法手の状態価値の計算
    best_actions = []
    alpha = -float('inf')
    beta = float('inf')
    piece_types = [2, 4]
    
    turn_num = 0
    next_player = "PLAYER"
    for piece_type in piece_types: 
        for action in state.legal_actions():
            next_state = state.next(action, piece_type)
            score = alpha_beta(next_state, next_player, alpha, beta, turn_num, max_turn_num)
            if debug:
                print("--------------------------------")
                print("put stone ", "action:", action, " piece_type:", piece_type)
                print(state)
                print("score: ", score, "alpha: ", alpha, "beta: ", beta)
                print(piece_type, action, score)
            # 相手(AI)の手番：α よりも小さい評価値になれば探索打ち切り => alpha = -infなので打ち切りなし
            if score == beta:
                best_actions.append((action, piece_type))
            elif  score < beta:
                beta = score
                best_actions = [(action, piece_type)]
            if debug:
                print("updated alpha, beta: ", "alpha: ", alpha, "beta: ", beta)
                print("--------------------------------")
    # 合法手の状態価値の最大値を持つ行動を返す
    # print("best_actions: ", best_actions)
    best_action = random.choice(best_actions)
    return {"best_action": best_action[0], "best_piece_type": best_action[1]}


def for_api(state, pieces, human_action, human_piece_type, game_level):
    if state.is_first_player():
        state.pieces = pieces
        next_user_state = state.next(human_action, human_piece_type)

        # playerが勝った場合
        if next_user_state.is_done(next_user_state):
            comp_place = next_user_state.comp_place(next_user_state)
            return {"win": "PLAYER", "comp_place": comp_place}
        
        if game_level == "easy":
            res_ai_action = random_action(next_user_state)
            ai_action = res_ai_action["ai_random_action"]
            ai_piece_type = res_ai_action["ai_piece_type"]
            next_ai_state = next_user_state.next(ai_action, ai_piece_type)
        elif game_level == "normal":
            res_ai_action = alpha_beta_action(next_user_state, 1)
            ai_action = res_ai_action["best_action"]
            ai_piece_type = res_ai_action["best_piece_type"]
            next_ai_state = next_user_state.next(ai_action, ai_piece_type)
        else:
            res_ai_action = alpha_beta_action(next_user_state, 3)
            ai_action = res_ai_action["best_action"]
            ai_piece_type = res_ai_action["best_piece_type"]
            next_ai_state = next_user_state.next(ai_action, ai_piece_type)

        # AIが勝った場合
        if next_ai_state.is_lose(next_ai_state, 4):
            comp_place = next_ai_state.comp_place(next_ai_state)

            return {"next_user_state": next_user_state.pieces, "ai_action": ai_action,
         "ai_piece_type": ai_piece_type, "next_ai_state": next_ai_state.pieces, "win": "AI", "comp_place": comp_place}
        
        # 引き分けだった場合
        if next_ai_state.is_draw():
            return {"next_user_state": next_user_state.pieces, "ai_action": ai_action,
         "ai_piece_type": ai_piece_type, "next_ai_state": next_ai_state.pieces, "win": "DRAW"}
        
        # 勝敗がつかなかった場合
        return {"next_user_state": next_user_state.pieces, "ai_action": ai_action,
         "ai_piece_type": ai_piece_type, "next_ai_state": next_ai_state.pieces, "win": "NON"}

def main():
    # 状態の生成
    state = State()
    print("|  0  |  1  |  2  |  3  |  4  |  5  |  6  |")
    print(state)
    # ゲーム終了までのループ
    while True:
        # ゲーム終了時
        if state.is_done(state):
            print(state.comp_place(state))
            break

        if state.is_first_player():
            human_action = int(input("0~6の数字を入力してください"))
            human_piece_type = int(input("1, 3の数字を入力してください"))
            state = state.next(human_action, human_piece_type)
        else:
            ab_action = alpha_beta_action(state, 3)
            ai_action = ab_action["best_action"]
            ai_piece_type = ab_action["best_piece_type"]
            state = state.next(ai_action, ai_piece_type)

        # 文字列表示
        print("|  0  |  1  |  2  |  3  |  4  |  5  |  6  |")
        print(state)
        print()
    
    print("ゲーム終了")


# 動作確認
if __name__ == '__main__':
    main()