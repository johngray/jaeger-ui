// Copyright (c) 2017 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// eslint-disable-next-line import/prefer-default-export
const hasNameTag = ({ key, value}) => (key === 'name') && value;

export function getTraceName(spans) {

  const spansWithNameTag = spans.filter(sp => sp.tags && sp.tags.some(hasNameTag));
  if (spansWithNameTag && spansWithNameTag.length) {
    let name = `${spansWithNameTag[0].process.serviceName}: ${spansWithNameTag[0].operationName}`;
    for (let i = 0; i < spansWithNameTag.length; i++) {
      let span = spansWithNameTag[i];
      for (let j = 0; j < span.tags.length; j++) {
        let { key, value} = span.tags[j];
        if (key == 'name') {
            name = `${span.process.serviceName}: ${value}`;
        }
      }
    }

    return name;
  }

  const span = spans.filter(sp => !sp.references || !sp.references.length)[0];
  return span ? `${span.process.serviceName}: ${span.operationName}` : '';
}
