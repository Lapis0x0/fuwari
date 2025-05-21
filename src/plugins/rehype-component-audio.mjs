import { visit } from "unist-util-visit";

/**
 * Handles directives of the name `audio`.
 * Expected Markdown syntax: `!audio[alt text](audio_url "optional title")`
 *
 * - `node.name` should be "audio".
 * - `node.children` would contain "alt text" (currently ignored).
 * - `node.attributes.default` is expected to contain 'audio_url "optional title"'.
 *
 * Transforms the directive node into an <audio-player> element
 * that Astro can then map to the AudioPlayer.astro component.
 */
export function rehypeComponentAudio() {
  return (tree) => {
    visit(tree, (node) => {
      // Add robust checks for node and its type property
      if (node && typeof node.type === 'string') {
        // Now, proceed with the original logic, but ensure it's safe
        if (
          (node.type === "textDirective" ||
            node.type === "leafDirective" ||
            node.type === "containerDirective") &&
          node.name === "audio" // This check is now safer due to the outer check
        ) {
          const attributes = node.attributes || {}; // Good guard
          let audio_url = "";
          let title = "";

          // Ensure attributes.default is a string before .match
          if (typeof attributes.default === 'string') {
            const defaultAttrContent = attributes.default;
            // Regex to extract src (required) and an optional title in quotes
            const match = defaultAttrContent.match(/^([\S]+)(?:\s+"([^"]+)")?\s*$/);
            if (match) {
              audio_url = match[1];
              if (match[2]) {
                title = match[2];
              }
            }
          } // else: attributes.default is not a string, so skip trying to parse it.

          if (audio_url) {
            // Transform the node into an <audio-player> element.
            node.type = "element";
            node.tagName = "audio-player";
            node.properties = {
              src: audio_url,
            };
            if (title) {
              node.properties.title = title;
            }
            // Clear children derived from the directive, as AudioPlayer.astro handles its own content.
            node.children = [];
          }
          // else: if audio_url is not found, the directive will effectively be removed or become an empty node.
          // Consider replacing with a text node indicating an error if debugging is needed.
          // node.type = 'text';
          // node.value = `[Error processing !audio directive: Could not parse audio URL from "${attributes.default}"]`;
        }
      } // else: node is null/undefined or node.type is not a string, so skip.
    });
  };
}

// Default export for Astro integration
export default rehypeComponentAudio;
