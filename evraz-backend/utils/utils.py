# -*- coding: utf-8 -*-
import json

with open('utils/pattern.json', 'r', encoding='utf-8') as f:
    pattern = json.load(f)


class BetterDict(dict):
    __getattr__ = dict.get
    __setattr__ = dict.__setitem__
    __delattr__ = dict.__delitem__

    @staticmethod
    def loads(obj):
        return json.loads(obj, object_pairs_hook=lambda x: BetterDict(x))


def convert_from_kafka(data):

    result = json.loads(json.dumps(pattern))
    for index, exhauster in enumerate(pattern):
        for key, value in exhauster.items():
            if key == 'title':
                continue
            if key == 'bearings':
                for num, item in enumerate(value):
                    for sindex, sensor in enumerate(item):
                        for k, v in sensor.items():
                            result[index][key][num][sindex][k] = data.get(v, 0)
                        param = list(sensor.keys())[0]
                        values = result[index][key][num][sindex]
                        status = 'error' if values[param] >= values['alarm_max'] else 'warning' if values[param] >= values['warning_max'] else 'default'
                        result[index][key][num][sindex] = {param: values[param], 'status': status}
            else:
                for k, v in value.items():
                    result[index][key][k] = data.get(v, 0)

    renewed_dates = ['09.02.2023', '19.01.2023', '02.02.2023', '13.02.2023', '25.01.2023', '06.02.2023']
    rotor_indexes = ['22', '29', '37', '27', '39', '45']

    for i in range(6):
        result[i]['renewed'] = renewed_dates[i]
        result[i]['rotorNum'] = rotor_indexes[i]

    return [
        {'id': 1, 'title': 'Агломашина №1', 'exhausters': [result[0], result[1]]},
        {'id': 2, 'title': 'Агломашина №2', 'exhausters': [result[2], result[3]]},
        {'id': 3, 'title': 'Агломашина №3', 'exhausters': [result[4], result[5]]},
    ]
