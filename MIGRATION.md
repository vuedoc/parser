# Vuedoc Parser Migration Note

## Migration to Vuedoc Parser 3.0.0

**Native TypeScript support**

Since the Vuedoc Parser 3.0.0, the parser now supports TypeScript natively.
It's no longer necessary to use a specific Vuedoc Loader to parse a component
written with TypeScript.

**Removed**

The property `PropEntry.nativeType` was removed.

```diff
interface PropEntry extends Entry {
  kind: 'prop';
  name: string;               // v-model when the @model keyword is attached
  type: string | string[];    // ex. Array, Object, String, [String, Number]
-  nativeType: NativeTypeEnum;
  default?: string;
  required: boolean;
  describeModel: boolean;     // true when the @model keyword is attached
}
```
