from django.http import HttpResponse
from django.shortcuts import render
from .game import for_api, random_action, State
import json

def input_stones(request):
    req = request.GET
    get_dict = dict(req)
    action = get_dict['action'][0]
    piece_type = get_dict['piece_type'][0]
    before_user_state = [int(piece) for piece in get_dict['before_user_state[]']]
    game_level = get_dict['game_level'][0]

    state = State()
    action = int(action)
    piece_type = int(piece_type)
    
    param = for_api(state, before_user_state, action, piece_type, game_level)
    res = json.dumps(param, ensure_ascii=False)
    return HttpResponse(res)