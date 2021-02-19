import api from './anyapi';
import { logMsg } from './utils';

const PORT = 2000;

api(`http://localhost:${PORT}`).listen(PORT);

logMsg('anyapi listening on port ' + PORT);
