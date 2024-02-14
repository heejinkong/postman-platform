import { Item } from '../../../repository/Item';
import { v4 as uuidv4 } from 'uuid';

export class globalsItem implements Item {
  id: string = '';
  title: string = '';
  parentId: string = '';
  created: number = Date.now();
  updated: number = Date.now();
  authorId: string = '';
  workspaceId: string = '';
  variablesSelection: string[] = [];
  variables: {
    id: string;
    _variable: string;
    _initialValue: string;
    _currentValue: string;
  }[] = [
    {
      id: uuidv4(),
      _variable: '',
      _initialValue: '',
      _currentValue: '',
    },
  ];
}
